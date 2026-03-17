import type { ByrealContext } from "../types/config.js";
import type { Result, PaginatedResult } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { Pool, PoolDetail, PoolListParams } from "../types/pool.js";
import type { Kline, KlineParams } from "../types/kline.js";
import * as poolsApi from "../api/pools.js";
import * as klineApi from "../api/kline.js";

export class PoolService {
  constructor(private ctx: ByrealContext) {}

  async list(params?: PoolListParams): Promise<Result<PaginatedResult<Pool>, ByrealError>> {
    return poolsApi.listPools(this.ctx.apiClient, params);
  }

  async getDetail(poolAddress: string): Promise<Result<PoolDetail, ByrealError>> {
    return poolsApi.getPoolDetail(this.ctx.apiClient, poolAddress);
  }

  async getBatch(poolAddresses: string[]): Promise<Result<Pool[], ByrealError>> {
    return poolsApi.getPoolsBatch(this.ctx.apiClient, poolAddresses);
  }

  async getKlines(params: KlineParams): Promise<Result<Kline[], ByrealError>> {
    return klineApi.getKlines(this.ctx.apiClient, params);
  }
}
