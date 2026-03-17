import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { OrderListParams } from "../types/order.js";
import type { ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function listOrders(
  client: ApiClient,
  params: OrderListParams,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(API_ENDPOINTS.ORDER_LIST, {
    userAddress: params.userAddress,
    page: params.page || 1,
    pageSize: params.pageSize || 20,
  });

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}
