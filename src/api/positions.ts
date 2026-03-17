import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { PositionItem, PositionListResult, PositionListParams } from "../types/position.js";
import type { ApiPositionListResponse, ApiPositionItem, ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function listPositions(
  client: ApiClient,
  params: PositionListParams,
): Promise<Result<PositionListResult, ByrealError>> {
  const result = await client.get<ApiPositionListResponse>(API_ENDPOINTS.POSITIONS_LIST, {
    userAddress: params.userAddress,
    page: params.page || 1,
    pageSize: params.pageSize || 20,
    sortField: params.sortField,
    sortType: params.sortType,
    poolAddress: params.poolAddress,
    status: params.status,
  });

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok({ positions: [], total: 0 });
  }

  const poolMap = data.poolMap || {};
  const positions: PositionItem[] = (data.positions || data.records || []).map(
    (item: ApiPositionItem) => {
      const poolInfo = poolMap[item.poolAddress];
      const symbolA = poolInfo?.mintA?.symbol || "";
      const symbolB = poolInfo?.mintB?.symbol || "";
      return {
        positionAddress: item.positionAddress,
        nftMintAddress: item.nftMintAddress,
        poolAddress: item.poolAddress,
        tickLower: item.lowerTick,
        tickUpper: item.upperTick,
        status: item.status,
        liquidityUsd: item.liquidityUsd,
        earnedUsd: item.earnedUsd,
        earnedUsdPercent: item.earnedUsdPercent,
        pnlUsd: item.pnlUsd,
        pnlUsdPercent: item.pnlUsdPercent,
        apr: item.apr,
        bonusUsd: item.bonusUsd,
        pair: symbolA && symbolB ? `${symbolA}/${symbolB}` : undefined,
        tokenSymbolA: symbolA || undefined,
        tokenSymbolB: symbolB || undefined,
      };
    },
  );

  return ok({ positions, total: data.total });
}

export async function getPositionDetail(
  client: ApiClient,
  positionAddress: string,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.POSITION_DETAIL,
    { address: positionAddress },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function getPositionOverview(
  client: ApiClient,
  userAddress: string,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.POSITION_OVERVIEW,
    { userAddress },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function getUnclaimedData(
  client: ApiClient,
  userAddress: string,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.POSITION_UNCLAIMED,
    { userAddress },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function getUnclaimedDataV2(
  client: ApiClient,
  userAddress: string,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.POSITION_UNCLAIMED_V2,
    { userAddress },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}
