// ============================================
// Position Types
// ============================================

export interface PositionItem {
  positionAddress: string;
  nftMintAddress: string;
  poolAddress: string;
  tickLower: number;
  tickUpper: number;
  status: number;
  liquidityUsd?: string;
  earnedUsd?: string;
  earnedUsdPercent?: string;
  pnlUsd?: string;
  pnlUsdPercent?: string;
  apr?: string;
  bonusUsd?: string;
  pair?: string;
  tokenSymbolA?: string;
  tokenSymbolB?: string;
}

export interface PositionListResult {
  positions: PositionItem[];
  total: number;
}

// ============================================
// Position Query Parameters
// ============================================

export interface PositionListParams {
  userAddress: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortType?: "asc" | "desc";
  poolAddress?: string;
  status?: number;
}

// ============================================
// Position Operations
// ============================================

export interface OpenPositionParams {
  poolAddress: string;
  priceLower: string | number;
  priceUpper: string | number;
  /** Base token: 'MintA' or 'MintB' (required unless amountUsd is specified) */
  base?: "MintA" | "MintB";
  /** Amount of base token in UI units */
  amount?: string;
  /** Investment amount in USD (auto-calculates token split) */
  amountUsd?: number;
  /** Slippage tolerance in basis points */
  slippageBps?: number;
  /** User's wallet public key */
  userAddress: string;
  /** Referrer position address for copy farming (adds memo instruction) */
  refererPosition?: string;
}

export interface OpenPositionResult {
  signature: string;
  confirmed: boolean;
  nftAddress?: string;
}

export interface ClosePositionParams {
  nftMint: string;
  slippageBps?: number;
  userAddress: string;
}

export interface ClosePositionResult {
  signature: string;
  confirmed: boolean;
}

export interface ClaimFeesParams {
  /** NFT mint addresses of positions to claim fees from */
  nftMints: string[];
  userAddress: string;
}

export interface ClaimFeesResult {
  signatures: string[];
  confirmed: boolean;
}
