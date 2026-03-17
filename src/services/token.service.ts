import type { ByrealContext } from "../types/config.js";
import type { Result, PaginatedResult } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { Token, TokenListParams } from "../types/token.js";
import * as tokensApi from "../api/tokens.js";

export class TokenService {
  constructor(private ctx: ByrealContext) {}

  async list(params?: TokenListParams): Promise<Result<PaginatedResult<Token>, ByrealError>> {
    return tokensApi.listTokens(this.ctx.apiClient, params);
  }

  async getPrices(mints: string[]): Promise<Result<Record<string, number>, ByrealError>> {
    return tokensApi.getTokenPrices(this.ctx.apiClient, mints);
  }

  async getByIds(ids: string[]): Promise<Result<Token[], ByrealError>> {
    return tokensApi.getTokensByIds(this.ctx.apiClient, ids);
  }

  async getMultiplier(mints: string[]): Promise<Result<Record<string, string>, ByrealError>> {
    return tokensApi.getTokenMultiplier(this.ctx.apiClient, mints);
  }
}
