import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { GlobalOverview } from "../types/overview.js";
import type {
  ApiResponse,
  PaginatedApiResult,
  ApiSimplePoolInfo,
  ApiOverviewGlobalDTO,
} from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { transformOverview } from "./transform.js";
import { ok } from "../types/common.js";

export async function getGlobalOverview(
  client: ApiClient,
): Promise<Result<GlobalOverview, ByrealError>> {
  const [overviewResult, poolsResult] = await Promise.all([
    client.get<ApiResponse<ApiOverviewGlobalDTO>>(API_ENDPOINTS.OVERVIEW_GLOBAL),
    client.get<ApiResponse<PaginatedApiResult<ApiSimplePoolInfo>>>(API_ENDPOINTS.POOLS_LIST, {
      page: 1,
      pageSize: 1,
    }),
  ]);

  if (!overviewResult.ok) return overviewResult;

  const data = overviewResult.value.result?.data;
  const poolsTotal = poolsResult.ok ? (poolsResult.value.result?.data?.total ?? 0) : 0;

  if (!data) {
    return ok({
      tvl: 0,
      tvl_change_24h: 0,
      volume_24h_usd: 0,
      volume_change_24h: 0,
      volume_all: 0,
      fee_24h_usd: 0,
      fee_change_24h: 0,
      fee_all: 0,
      pools_count: poolsTotal,
    });
  }

  const overview = transformOverview(data);
  overview.pools_count = poolsTotal;
  return ok(overview);
}
