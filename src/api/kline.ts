import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { Kline, KlineParams } from "../types/kline.js";
import type { ApiResponse, ApiKlineData } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { transformKline } from "./transform.js";
import { ok } from "../types/common.js";

export async function getKlines(
  client: ApiClient,
  params: KlineParams,
): Promise<Result<Kline[], ByrealError>> {
  const result = await client.get<ApiResponse<ApiKlineData[]>>(API_ENDPOINTS.POOL_KLINES, {
    tokenAddress: params.tokenAddress,
    poolAddress: params.poolAddress,
    klineType: params.klineType,
    startTime: params.startTime,
    endTime: params.endTime,
  });

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok([]);
  }

  return ok(data.map(transformKline));
}
