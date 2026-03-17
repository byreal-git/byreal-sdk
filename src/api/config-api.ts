import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function getAutoFee(
  client: ApiClient,
): Promise<Result<{ high: number; medium: number; extreme: number }, ByrealError>> {
  const result = await client.get<ApiResponse<{ high: number; medium: number; extreme: number }>>(
    API_ENDPOINTS.AUTO_FEE,
  );

  if (!result.ok) return result;

  const data = result.value.result?.data;
  return ok(data ?? { high: 0, medium: 0, extreme: 0 });
}

export async function getJitoTip(
  client: ApiClient,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(API_ENDPOINTS.JITO_TIP);

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}

export async function getFrontendConfig(
  client: ApiClient,
): Promise<Result<Record<string, unknown>, ByrealError>> {
  const result = await client.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.FRONTEND_CONFIG,
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? {});
}
