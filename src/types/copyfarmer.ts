// ============================================
// Copy Farmer / Top Positions Types
// ============================================

export type TopPositionsSortField =
  | "liquidity"
  | "earned"
  | "pnl"
  | "copies"
  | "bonus"
  | "closeTime";

export interface TopPositionsParams {
  poolAddress: string;
  page?: number;
  pageSize?: number;
  sortField?: TopPositionsSortField;
  sortType?: "asc" | "desc";
  status?: number;
}

export interface TopPositionItem {
  poolAddress: string;
  positionAddress: string;
  nftMintAddress: string;
  walletAddress: string;
  tickLower: number;
  tickUpper: number;
  status: number;
  liquidityUsd: string;
  earnedUsd: string;
  earnedUsdPercent: string;
  pnlUsd: string;
  pnlUsdPercent: string;
  bonusUsd: string;
  copies: number;
  positionAgeMs: number;
  totalDeposit: string;
  totalClaimedFeesRewards: string;
  pair?: string;
  tokenSymbolA?: string;
  tokenSymbolB?: string;
  inRange?: boolean;
  priceLower?: string;
  priceUpper?: string;
}

export interface TopPositionsResult {
  positions: TopPositionItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TopFarmersParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortType?: "asc" | "desc";
}

export interface TopFarmerItem {
  walletAddress: string;
  totalLiquidityUsd: string;
  totalEarnedUsd: string;
  totalPnlUsd: string;
  positionCount: number;
  copies: number;
}

export interface CopyFarmerOverview {
  totalPositions: number;
  totalLiquidityUsd: string;
  totalEarnedUsd: string;
  totalFarmers: number;
}

export interface CopyPositionParams {
  /** Source position address to copy */
  sourcePositionAddress: string;
  /** Investment amount in USD */
  amountUsd: number;
  /** User's wallet public key */
  userAddress: string;
  /** Slippage tolerance in basis points */
  slippageBps?: number;
}
