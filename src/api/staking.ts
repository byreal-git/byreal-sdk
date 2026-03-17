import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { BbsolStats, SendBbsolTxParams } from "../types/staking.js";
import type { ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function getBbsolStats(client: ApiClient): Promise<Result<BbsolStats, ByrealError>> {
  const result = await client.get<ApiResponse<BbsolStats>>(API_ENDPOINTS.BBSOL_STATS);

  if (!result.ok) return result;

  const data = result.value.result?.data;
  return ok(data ?? { totalStaked: "0", apy: "0", exchangeRate: "0" });
}

export async function sendBbsolTx(
  client: ApiClient,
  params: SendBbsolTxParams,
): Promise<Result<void, ByrealError>> {
  const result = await client.post<ApiResponse<unknown>>(API_ENDPOINTS.BBSOL_TX, {
    data: params.transactions,
  });

  if (!result.ok) return result;
  return ok(undefined);
}
