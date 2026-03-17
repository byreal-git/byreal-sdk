import type { ApiClient } from "./client.js";
import type { Result, PaginatedResult } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { Token, TokenListParams } from "../types/token.js";
import type { ApiResponse, PaginatedApiResult, ApiMintItem } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { transformToken } from "./transform.js";
import { ok } from "../types/common.js";

export async function listTokens(
  client: ApiClient,
  params: TokenListParams = {},
): Promise<Result<PaginatedResult<Token>, ByrealError>> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;

  const result = await client.get<ApiResponse<PaginatedApiResult<ApiMintItem>>>(
    API_ENDPOINTS.TOKENS_LIST,
    {
      page,
      pageSize,
      sortField: params.sortField || "volumeUsd24h",
      sort: params.sort || "desc",
      searchKey: params.searchKey,
      category: params.category,
      status: params.status,
    },
  );

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok({ items: [], total: 0, page, pageSize });
  }

  return ok({
    items: data.records.map(transformToken),
    total: data.total,
    page: data.pageNum,
    pageSize: data.pageSize,
  });
}

export async function getTokenPrices(
  client: ApiClient,
  mints: string[],
): Promise<Result<Record<string, number>, ByrealError>> {
  if (mints.length === 0) {
    return ok({});
  }

  const result = await client.get<ApiResponse<Record<string, string>>>(API_ENDPOINTS.TOKEN_PRICE, {
    mints: mints.join(","),
  });

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok({});
  }

  const prices: Record<string, number> = {};
  for (const [mint, priceStr] of Object.entries(data)) {
    prices[mint] = parseFloat(priceStr || "0");
  }
  return ok(prices);
}

export async function getTokensByIds(
  client: ApiClient,
  ids: string[],
): Promise<Result<Token[], ByrealError>> {
  const result = await client.get<ApiResponse<ApiMintItem[]>>(API_ENDPOINTS.TOKENS_BY_IDS, {
    ids: ids.join(","),
  });

  if (!result.ok) return result;

  const data = result.value.result?.data;
  if (!data) {
    return ok([]);
  }

  return ok(data.map(transformToken));
}

export async function getTokenMultiplier(
  client: ApiClient,
  mints: string[],
): Promise<Result<Record<string, string>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, string>>>(
    API_ENDPOINTS.TOKEN_MULTIPLIER,
    { mints: mints.join(",") },
  );

  if (!result.ok) return result;

  const data = result.value.result?.data;
  return ok(data ?? {});
}
