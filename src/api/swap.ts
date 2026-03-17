import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type {
  SwapQuote,
  SwapQuoteParams,
  SwapAmmExecuteParams,
  SwapRfqExecuteParams,
} from "../types/swap.js";
import type { ApiResponse, ApiSwapQuoteResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { apiError } from "../errors/errors.js";
import { ok, err } from "../types/common.js";

const DEFAULT_CU_PRICE = 100000;

/**
 * Fetch current CU price from auto-fee API (Turbo = "high" tier)
 */
async function fetchCuPrice(client: ApiClient): Promise<number> {
  try {
    const result = await client.get<any>(API_ENDPOINTS.AUTO_FEE);
    if (result.ok) {
      const data = result.value?.result?.data ?? result.value;
      const high = data?.high;
      if (typeof high === "number" && high > 0) return high;
    }
  } catch {
    // ignore — use fallback
  }
  return DEFAULT_CU_PRICE;
}

export async function getSwapQuote(
  client: ApiClient,
  params: SwapQuoteParams,
): Promise<Result<SwapQuote, ByrealError>> {
  const SOL_MINT = "So11111111111111111111111111111111111111112";
  const cuPrice = await fetchCuPrice(client);

  const result = await client.post<ApiSwapQuoteResponse>(API_ENDPOINTS.SWAP_QUOTE, {
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    swapMode: params.swapMode,
    slippageBps: String(params.slippageBps),
    userPublicKey: params.userPublicKey,
    ...(params.inputMint === SOL_MINT ? { createInputAta: true } : {}),
    ...(params.outputMint === SOL_MINT ? { createOutputAta: true } : {}),
    broadcastMode: "priority",
    feeType: "maxCap",
    feeAmount: "10000000",
    cuPrice: String(cuPrice),
  });

  if (!result.ok) return result;

  const outerResult = result.value.result as Record<string, unknown> | undefined;
  if (!outerResult || !outerResult.inputMint) {
    return err(apiError("No swap quote data returned from router"));
  }

  return ok({
    outAmount: String(outerResult.outAmount || ""),
    inAmount: String(outerResult.inAmount || ""),
    inputMint: String(outerResult.inputMint || ""),
    outputMint: String(outerResult.outputMint || ""),
    transaction: String(outerResult.transaction || ""),
    priceImpactPct:
      outerResult.priceImpactPct != null ? String(outerResult.priceImpactPct) : undefined,
    routerType: String(outerResult.routerType || "AMM"),
    orderId: outerResult.orderId ? String(outerResult.orderId) : undefined,
    quoteId: outerResult.quoteId ? String(outerResult.quoteId) : undefined,
    poolAddresses: Array.isArray(outerResult.poolAddresses)
      ? (outerResult.poolAddresses as string[])
      : [],
  });
}

export async function executeSwapAmm(
  client: ApiClient,
  params: SwapAmmExecuteParams,
): Promise<Result<{ signatures: string[] }, ByrealError>> {
  const result = await client.post<ApiResponse<string[]>>(API_ENDPOINTS.SWAP_EXECUTE_AMM, {
    preData: params.preData,
    data: params.data,
    userSignTime: params.userSignTime,
  });

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return ok({ signatures: [] });
  }

  return ok({ signatures: data });
}

export async function executeSwapRfq(
  client: ApiClient,
  params: SwapRfqExecuteParams,
): Promise<Result<{ txSignature: string; state: string }, ByrealError>> {
  const result = await client.post<ApiResponse<{ txSignature: string; state: string }>>(
    API_ENDPOINTS.RFQ_SWAP,
    {
      quoteId: params.quoteId,
      requestId: params.requestId,
      transaction: params.transaction,
    },
  );

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return err(apiError("No RFQ swap result returned"));
  }

  return ok(data);
}

export async function sendLiquidityTx(
  client: ApiClient,
  params: { preData: string[]; data: string[]; userSignTime: number },
): Promise<Result<{ signatures: string[] }, ByrealError>> {
  const result = await client.post<ApiResponse<string[]>>(API_ENDPOINTS.LIQUIDITY_SEND, params);

  if (!result.ok) return result;

  const data = result.value.result?.data;
  return ok({ signatures: data ?? [] });
}
