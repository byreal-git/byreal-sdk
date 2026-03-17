import type { ByrealContext } from "../types/config.js";
import type { Result, SignerCallback, PreparedTransaction } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { SwapQuote, SwapQuoteParams, SwapExecuteParams, SwapResult } from "../types/swap.js";
import * as swapApi from "../api/swap.js";
import {
  deserializeTransaction,
  serializeTransaction,
  confirmSignatures,
  refreshBlockhash,
} from "../utils/transaction.js";
import { apiError, transactionError } from "../errors/errors.js";
import { ok, err } from "../types/common.js";

export class SwapService {
  constructor(private ctx: ByrealContext) {}

  /**
   * Get a swap quote (preview only, no execution)
   */
  async getQuote(params: SwapQuoteParams): Promise<Result<SwapQuote, ByrealError>> {
    return swapApi.getSwapQuote(this.ctx.apiClient, {
      ...params,
      slippageBps: params.slippageBps ?? this.ctx.config.defaultSlippageBps,
    });
  }

  /**
   * Prepare an unsigned swap transaction
   */
  async prepareSwap(params: SwapExecuteParams): Promise<Result<PreparedTransaction, ByrealError>> {
    const slippageBps = params.slippageBps ?? this.ctx.config.defaultSlippageBps;

    const quoteResult = await swapApi.getSwapQuote(this.ctx.apiClient, {
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      swapMode: params.swapMode,
      slippageBps,
      userPublicKey: params.userPublicKey,
    });

    if (!quoteResult.ok) return quoteResult;

    const quote = quoteResult.value;
    if (!quote.transaction) {
      return err(apiError("No transaction returned in swap quote"));
    }

    const txResult = deserializeTransaction(quote.transaction);
    if (!txResult.ok) return txResult;

    return ok({
      transaction: txResult.value,
      metadata: {
        quote,
        inputMint: quote.inputMint,
        outputMint: quote.outputMint,
        inAmount: quote.inAmount,
        outAmount: quote.outAmount,
        routerType: quote.routerType,
        orderId: quote.orderId,
        quoteId: quote.quoteId,
      },
    });
  }

  /**
   * Execute a full swap: quote → sign → submit → confirm
   */
  async executeSwap(
    params: SwapExecuteParams & { signerCallback: SignerCallback },
  ): Promise<Result<SwapResult, ByrealError>> {
    const slippageBps = params.slippageBps ?? this.ctx.config.defaultSlippageBps;

    // 1. Get quote
    const quoteResult = await swapApi.getSwapQuote(this.ctx.apiClient, {
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      swapMode: params.swapMode,
      slippageBps,
      userPublicKey: params.userPublicKey,
    });

    if (!quoteResult.ok) return quoteResult;

    const quote = quoteResult.value;
    if (!quote.transaction) {
      return err(apiError("No transaction returned in swap quote"));
    }

    // 2. Deserialize, refresh blockhash, and sign
    const txResult = deserializeTransaction(quote.transaction);
    if (!txResult.ok) return txResult;

    await refreshBlockhash(this.ctx.connection, txResult.value);

    const signedTx = await params.signerCallback(txResult.value);
    const signedBase64 = serializeTransaction(signedTx);

    // 3. Execute based on router type
    let signatures: string[];

    if (quote.routerType === "RFQ" && quote.quoteId && quote.orderId) {
      const execResult = await swapApi.executeSwapRfq(this.ctx.apiClient, {
        quoteId: quote.quoteId,
        requestId: quote.orderId,
        transaction: signedBase64,
      });
      if (!execResult.ok) return execResult;
      signatures = [execResult.value.txSignature];
    } else {
      const execResult = await swapApi.executeSwapAmm(this.ctx.apiClient, {
        preData: [quote.transaction],
        data: [signedBase64],
        userSignTime: Date.now(),
      });
      if (!execResult.ok) return execResult;
      signatures = execResult.value.signatures;
    }

    if (signatures.length === 0) {
      return err(transactionError("No transaction signature returned from execute API"));
    }

    // 4. Confirm
    const { confirmed } = await confirmSignatures(this.ctx.connection, signatures);

    return ok({
      signatures,
      confirmed,
      inputMint: quote.inputMint,
      outputMint: quote.outputMint,
      inAmount: quote.inAmount,
      outAmount: quote.outAmount,
      routerType: quote.routerType,
    });
  }
}
