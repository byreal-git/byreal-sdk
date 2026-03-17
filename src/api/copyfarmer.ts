import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type {
  TopPositionsParams,
  TopPositionItem,
  TopPositionsResult,
  TopFarmersParams,
  CopyFarmerOverview,
} from "../types/copyfarmer.js";
import type { ApiTopPositionsResponse, ApiTopPositionItem, ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function getTopPositions(
  client: ApiClient,
  params: TopPositionsParams,
): Promise<Result<TopPositionsResult, ByrealError>> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;

  const result = await client.post<ApiTopPositionsResponse>(
    API_ENDPOINTS.COPYFARMER_TOP_POSITIONS,
    {
      poolAddress: params.poolAddress,
      page,
      pageSize,
      sortField: params.sortField || "liquidity",
      sortType: params.sortType || "desc",
      status: params.status ?? 0,
    },
  );

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok({ positions: [], total: 0, page, pageSize });
  }

  const poolMap = data.poolMap || {};
  const positions: TopPositionItem[] = (data.records || []).map((item: ApiTopPositionItem) => {
    const poolInfo = poolMap[item.poolAddress];
    const symbolA = poolInfo?.mintA?.symbol || "";
    const symbolB = poolInfo?.mintB?.symbol || "";
    return {
      poolAddress: item.poolAddress,
      positionAddress: item.positionAddress,
      nftMintAddress: item.nftMintAddress,
      walletAddress: item.walletAddress,
      tickLower: item.lowerTick,
      tickUpper: item.upperTick,
      status: item.status,
      liquidityUsd: item.liquidityUsd || "0",
      earnedUsd: item.earnedUsd || "0",
      earnedUsdPercent: item.earnedUsdPercent || "0",
      pnlUsd: item.pnlUsd || "0",
      pnlUsdPercent: item.pnlUsdPercent || "0",
      bonusUsd: item.bonusUsd || "0",
      copies: item.copies || 0,
      positionAgeMs: item.positionAgeMs || 0,
      totalDeposit: item.totalDeposit || "0",
      totalClaimedFeesRewards: item.totalClaimedFeesRewards || "0",
      pair: symbolA && symbolB ? `${symbolA}/${symbolB}` : undefined,
      tokenSymbolA: symbolA || undefined,
      tokenSymbolB: symbolB || undefined,
    };
  });

  return ok({
    positions,
    total: data.total,
    page: data.pageNum,
    pageSize: data.pageSize,
  });
}

export async function getCopyFarmerOverview(
  client: ApiClient,
): Promise<Result<CopyFarmerOverview, ByrealError>> {
  const result = await client.get<ApiResponse<CopyFarmerOverview>>(
    API_ENDPOINTS.COPYFARMER_OVERVIEW,
  );

  if (!result.ok) return result;
  const data = result.value.result?.data;
  return ok(
    data ?? { totalPositions: 0, totalLiquidityUsd: "0", totalEarnedUsd: "0", totalFarmers: 0 },
  );
}

export async function getTopFarmers(
  client: ApiClient,
  params: TopFarmersParams = {},
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.post<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.COPYFARMER_TOP_FARMERS,
    {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      sortField: params.sortField,
      sortType: params.sortType || "desc",
    },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function getProviderOverview(
  client: ApiClient,
  providerAddress: string,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.COPYFARMER_PROVIDER_OVERVIEW,
    { providerAddress },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function getEpochBonus(
  client: ApiClient,
  walletAddress: string,
  type: number,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.COPYFARMER_EPOCH_BONUS,
    { walletAddress, type },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}
