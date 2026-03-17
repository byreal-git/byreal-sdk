import type { VersionedTransaction } from "@solana/web3.js";

// ============================================
// Result Type
// ============================================

export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// ============================================
// Pagination
// ============================================

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// Signer
// ============================================

export type SignerCallback = (tx: VersionedTransaction) => Promise<VersionedTransaction>;

// ============================================
// Prepared Transaction
// ============================================

export interface PreparedTransaction {
  transaction: VersionedTransaction;
  metadata: Record<string, unknown>;
}
