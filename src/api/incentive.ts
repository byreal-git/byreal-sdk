import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type {
  FeeEncodeParams,
  FeeEncodeEntry,
  EncodeRewardParams,
  ClaimRewardParams,
} from "../types/incentive.js";
import type { ApiResponse, ApiFeeEncodeEntry } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function encodeFee(
  client: ApiClient,
  params: FeeEncodeParams,
): Promise<Result<FeeEncodeEntry[], ByrealError>> {
  const result = await client.post<ApiResponse<ApiFeeEncodeEntry[]>>(API_ENDPOINTS.FEE_ENCODE, {
    walletAddress: params.walletAddress,
    positionAddresses: params.positionAddresses,
  });

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok([]);
  }

  return ok(data);
}

export async function encodeRewardV2(
  client: ApiClient,
  params: EncodeRewardParams,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.post<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.INCENTIVE_ENCODE_V2,
    {
      walletAddress: params.walletAddress,
      positionAddresses: params.positionAddresses,
    },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function encodeRewardV3(
  client: ApiClient,
  params: EncodeRewardParams,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.post<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.INCENTIVE_ENCODE_V3,
    {
      walletAddress: params.walletAddress,
      positionAddresses: params.positionAddresses,
    },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function claimRewardV2(
  client: ApiClient,
  params: ClaimRewardParams,
): Promise<Result<boolean, ByrealError>> {
  const result = await client.post<ApiResponse<unknown>>(API_ENDPOINTS.INCENTIVE_ORDER_V2, {
    walletAddress: params.walletAddress,
    positionAddresses: params.positionAddresses,
    transactions: params.transactions,
  });

  if (!result.ok) return result;
  return ok(true);
}

export async function claimRewardV3(
  client: ApiClient,
  params: ClaimRewardParams,
): Promise<Result<boolean, ByrealError>> {
  const result = await client.post<ApiResponse<unknown>>(API_ENDPOINTS.INCENTIVE_ORDER_V3, {
    walletAddress: params.walletAddress,
    positionAddresses: params.positionAddresses,
    transactions: params.transactions,
  });

  if (!result.ok) return result;
  return ok(true);
}
