import type { ApiClient } from "./client.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type {
  AuctionInfo,
  AuctionListItem,
  WhitelistSignResult,
  UserCommitStatus,
  LaunchpadStatistics,
  SendLaunchpadOrderParams,
} from "../types/launchpad.js";
import type { ApiResponse } from "./api-types.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { ok } from "../types/common.js";

export async function getAuction(
  client: ApiClient,
  auctionAddress: string,
): Promise<Result<AuctionInfo, ByrealError>> {
  const result = await client.get<ApiResponse<AuctionInfo>>(API_ENDPOINTS.LAUNCHPAD_AUCTION, {
    auctionAddress,
  });

  if (!result.ok) return result;
  return ok(result.value.result?.data as AuctionInfo);
}

export async function listAuctions(
  client: ApiClient,
): Promise<Result<AuctionListItem[], ByrealError>> {
  const result = await client.get<ApiResponse<AuctionListItem[]>>(API_ENDPOINTS.LAUNCHPAD_LIST);

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? []);
}

export async function checkWhitelist(
  client: ApiClient,
  auctionAddress: string,
  walletAddress: string,
): Promise<Result<boolean, ByrealError>> {
  const result = await client.get<ApiResponse<boolean>>(API_ENDPOINTS.LAUNCHPAD_WHITELIST_CHECK, {
    auctionAddress,
    walletAddress,
  });

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? false);
}

export async function getWhitelistSign(
  client: ApiClient,
  auctionAddress: string,
  walletAddress: string,
): Promise<Result<WhitelistSignResult, ByrealError>> {
  const result = await client.get<ApiResponse<WhitelistSignResult>>(
    API_ENDPOINTS.LAUNCHPAD_WHITELIST_SIGN,
    { auctionAddress, walletAddress },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data as WhitelistSignResult);
}

export async function getCommitStatus(
  client: ApiClient,
  auctionAddress: string,
  walletAddress: string,
): Promise<Result<UserCommitStatus, ByrealError>> {
  const result = await client.get<ApiResponse<UserCommitStatus>>(
    API_ENDPOINTS.LAUNCHPAD_COMMIT_STATUS,
    { auctionAddress, walletAddress },
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data as UserCommitStatus);
}

export async function sendLaunchpadOrder(
  client: ApiClient,
  params: SendLaunchpadOrderParams,
): Promise<Result<string[], ByrealError>> {
  const result = await client.post<ApiResponse<string[]>>(API_ENDPOINTS.LAUNCHPAD_SEND_ORDER, {
    auctionAddress: params.auctionAddress,
    transactions: params.transactions,
  });

  if (!result.ok) return result;
  return ok(result.value.result?.data ?? []);
}

export async function getLaunchpadStatistics(
  client: ApiClient,
): Promise<Result<LaunchpadStatistics, ByrealError>> {
  const result = await client.get<ApiResponse<LaunchpadStatistics>>(
    API_ENDPOINTS.LAUNCHPAD_STATISTICS,
  );

  if (!result.ok) return result;
  return ok(result.value.result?.data as LaunchpadStatistics);
}
