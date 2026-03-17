import { VersionedTransaction, type Connection } from "@solana/web3.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import { transactionError, transactionTimeoutError, networkError } from "../errors/errors.js";
import { ok, err } from "../types/common.js";

/**
 * Deserialize a base64-encoded transaction
 */
export function deserializeTransaction(
  base64Tx: string,
): Result<VersionedTransaction, ByrealError> {
  try {
    const buffer = Buffer.from(base64Tx, "base64");
    const tx = VersionedTransaction.deserialize(buffer);
    return ok(tx);
  } catch (e) {
    return err(transactionError(`Failed to deserialize transaction: ${(e as Error).message}`));
  }
}

/**
 * Serialize a transaction to base64
 */
export function serializeTransaction(tx: VersionedTransaction): string {
  return Buffer.from(tx.serialize()).toString("base64");
}

/**
 * Replace the blockhash in a VersionedTransaction with a fresh one.
 * This is necessary for transactions built by the backend API, whose
 * blockhash may have expired by the time the client signs and sends.
 *
 * NOTE: Must be called BEFORE signing — changing the blockhash
 * invalidates any existing signatures.
 */
export async function refreshBlockhash(
  connection: Connection,
  tx: VersionedTransaction,
): Promise<void> {
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.message.recentBlockhash = blockhash;
  // Clear stale signatures — they were signed over the old message
  for (let i = 0; i < tx.signatures.length; i++) {
    tx.signatures[i] = new Uint8Array(64);
  }
}

/**
 * Send a signed transaction and poll for confirmation.
 *
 * skipPreflight defaults to true because backend-built transactions with
 * freshly-refreshed blockhashes often trigger false-positive
 * "BlockhashNotFound" in RPC preflight simulation due to cache lag.
 */
export async function sendAndConfirmTx(
  connection: Connection,
  tx: VersionedTransaction,
  options?: { timeoutMs?: number; pollIntervalMs?: number; skipPreflight?: boolean },
): Promise<Result<{ signature: string; confirmed: boolean }, ByrealError>> {
  const timeoutMs = options?.timeoutMs ?? 30_000;
  const pollIntervalMs = options?.pollIntervalMs ?? 2_000;
  const skipPreflight = options?.skipPreflight ?? true;

  let signature: string;
  try {
    signature = await connection.sendTransaction(tx, {
      skipPreflight,
      maxRetries: 3,
    });
  } catch (e) {
    return err(transactionError(`Failed to send transaction: ${(e as Error).message}`));
  }

  // Poll for confirmation
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const { value: statuses } = await connection.getSignatureStatuses([signature]);
      const status = statuses[0];
      if (status) {
        if (status.err) {
          return err(
            transactionError(
              `Transaction confirmed but failed on-chain: ${JSON.stringify(status.err)}`,
              signature,
            ),
          );
        }
        if (
          status.confirmationStatus === "confirmed" ||
          status.confirmationStatus === "finalized"
        ) {
          return ok({ signature, confirmed: true });
        }
      }
    } catch {
      // RPC error during polling — continue retrying until deadline
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  return ok({ signature, confirmed: false });
}

/**
 * Poll for transaction confirmation by signatures
 */
export async function confirmSignatures(
  connection: Connection,
  signatures: string[],
  options?: { timeoutMs?: number; pollIntervalMs?: number },
): Promise<{ confirmed: boolean; failedSignature?: string }> {
  const timeoutMs = options?.timeoutMs ?? 10_000;
  const pollIntervalMs = options?.pollIntervalMs ?? 2_000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const { value: statuses } = await connection.getSignatureStatuses(signatures);
      for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        if (status?.err) {
          return { confirmed: false, failedSignature: signatures[i] };
        }
      }

      const allConfirmed = statuses.every(
        (s) => s && (s.confirmationStatus === "confirmed" || s.confirmationStatus === "finalized"),
      );
      if (allConfirmed) return { confirmed: true };
    } catch {
      // continue polling
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  return { confirmed: false };
}
