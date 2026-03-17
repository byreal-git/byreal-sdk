import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function getOnchainPoolDetail(
  client: ApiClient,
  poolAddresses: string[],
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.ONCHAIN_POOL_DETAIL,
    { poolAddresses: poolAddresses.join(",") },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function getOnchainPositions(
  client: ApiClient,
  positionAddresses: string[],
): Promise<Result<unknown[], ByrealError>> {
  const result = await client.get<ApiResponse<unknown[]>>(API_ENDPOINTS.ONCHAIN_POSITION_LIST, {
    positionAddresses: positionAddresses.join(","),
  });

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? []);
}

export async function getOnchainMints(
  client: ApiClient,
  tokenAddresses: string[],
): Promise<Result<unknown[], ByrealError>> {
  const result = await client.get<ApiResponse<unknown[]>>(API_ENDPOINTS.ONCHAIN_MINT_LIST, {
    tokenAddresses: tokenAddresses.join(","),
  });

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? []);
}
