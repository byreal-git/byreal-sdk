import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function rfqQuote(
  client: ApiClient,
  params: Record<string, unknown>,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.post<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.RFQ_QUOTE,
    params,
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function rfqSwap(
  client: ApiClient,
  params: Record<string, unknown>,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.post<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.RFQ_SWAP,
    params,
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function rfqTokens(client: ApiClient): Promise<Result<string[], ByrealError>> {
  const result = await client.get<ApiResponse<string[]>>(API_ENDPOINTS.RFQ_TOKENS);

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? []);
}
