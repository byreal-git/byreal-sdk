import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { Pool, PoolDetail, PoolListParams } from "../types/pool.js";
import type { PaginatedResult } from "../types/common.js";
import type { ApiResponse, PaginatedApiResult, ApiSimplePoolInfo } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { transformPool, transformPoolDetail } from "./transform.js";
import { poolNotFoundError } from "../errors/errors.js";
import { ok, err } from "../types/common.js";

export async function listPools(
  client: ApiClient,
  params: PoolListParams = {},
): Promise<Result<PaginatedResult<Pool>, ByrealError>> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;

  const result = await client.get<ApiResponse<PaginatedApiResult<ApiSimplePoolInfo>>>(
    API_ENDPOINTS.POOLS_LIST,
    {
      page,
      pageSize,
      sortField: params.sortField || "tvl",
      sortType: params.sortType || "desc",
      category: params.category,
      status: params.status,
      poolAddress: params.poolAddress,
    },
  );

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok({ items: [], total: 0, page, pageSize });
  }

  return ok({
    items: data.records.map(transformPool),
    total: data.total,
    page: data.pageNum,
    pageSize: data.pageSize,
  });
}

export async function getPoolDetail(
  client: ApiClient,
  poolAddress: string,
): Promise<Result<PoolDetail, ByrealError>> {
  const result = await client.get<ApiResponse<ApiSimplePoolInfo>>(API_ENDPOINTS.POOL_DETAILS, {
    poolAddress,
  });

  if (!result.ok) return result;

  const poolData = result.value.result?.data;
  if (!poolData) {
    return err(poolNotFoundError(poolAddress));
  }

  return ok(transformPoolDetail(poolData));
}

export async function getPoolsBatch(
  client: ApiClient,
  poolAddresses: string[],
): Promise<Result<Pool[], ByrealError>> {
  const result = await client.post<ApiResponse<ApiSimplePoolInfo[]>>(API_ENDPOINTS.POOLS_BATCH, {
    poolAddresses,
  } as unknown as Record<string, unknown>);

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok([]);
  }

  return ok(data.map(transformPool));
}
