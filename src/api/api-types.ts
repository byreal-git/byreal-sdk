/**
 * Raw API response types (internal, not exported from the SDK)
 * These map directly to the backend API response format.
 */

// ============================================
// API Response Envelope
// ============================================

export interface ApiResponse<T> {
  retCode: number;
  retMsg: string;
  result: {
    success: boolean;
    version: string;
    timestamp: number;
    ret_code: number;
    ret_msg: string | null;
    data: T;
  };
  retExtInfo: Record<string, unknown>;
  time: number;
}

export interface PaginatedApiResult<T> {
  total: number;
  pageNum: number;
  pageSize: number;
  current: number;
  pages: number;
  records: T[];
}

// ============================================
// Pool API Types
// ============================================

export interface ApiMintInfo {
  programId: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
}

export interface ApiMintWithPrice {
  mintInfo: ApiMintInfo;
  price: string;
}

export interface ApiPoolFeeRate {
  fixFeeRate: string;
  decayFeeInUse: number;
  decayFeeInitFeeRate: number;
  decayFeeDecreaseRate: number;
  decayFeeDecreaseInterval: number;
}

export interface ApiPoolRewardItem {
  mint: ApiMintInfo;
  rewardPerSecond: string;
  rewardOpenTime: number;
  rewardEndTime: number;
  rewardType: number;
}

export interface ApiSimplePoolInfo {
  poolAddress: string;
  mintA: ApiMintWithPrice;
  mintB: ApiMintWithPrice;
  baseMint?: ApiMintWithPrice;
  quoteMint?: ApiMintWithPrice;
  feeRate?: ApiPoolFeeRate;
  category?: number;
  price?: string;
  priceChange1h?: string;
  priceChange12h?: string;
  priceChange1d?: string;
  priceChange7d?: string;
  tvl?: string;
  volumeUsd1h?: string;
  volumeUsd12h?: string;
  volumeUsd24h?: string;
  volumeUsd1d?: string;
  volumeUsd7d?: string;
  feeUsd1h?: string;
  feeUsd12h?: string;
  feeUsd1d?: string;
  feeUsd24h?: string;
  feeUsd7d?: string;
  feeApr24h?: string;
  totalBonus?: string;
  openTime?: number;
  decayFeeFlag?: number;
  rewards?: ApiPoolRewardItem[];
  displayReversed?: boolean;
  dayPriceRange?: {
    lowPrice: string;
    highPrice: string;
  };
}

// ============================================
// Token API Types
// ============================================

export interface ApiMintItem {
  address: string;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  price: string;
  programId: string;
  tvl: string;
  category: number;
  priceChange24h: string;
  volumeUsd24h: string;
  circulatingSupply?: string;
  totalSupply?: string;
  labels?: string[];
  beginTradeTimestamp?: number;
  status: number;
  multiplier?: string;
}

// ============================================
// Overview API Types
// ============================================

export interface ApiOverviewGlobalDTO {
  tvl?: string;
  tvlChange?: string;
  volumeUsd24h?: string;
  volumeUsd24hChange?: string;
  feeUsd24h?: string;
  feeUsd24hChange?: string;
  feeAll?: string;
  volumeAll?: string;
}

// ============================================
// K-Line API Types
// ============================================

export interface ApiKlineData {
  t: string | number;
  s: string;
  c: string;
  h: string;
  l: string;
  o: string;
  v: string;
}

// ============================================
// Swap API Types
// ============================================

export interface ApiSwapQuoteResponse {
  retCode: number;
  retMsg: string;
  result: Record<string, unknown>;
  retExtInfo: Record<string, unknown>;
  time: number;
}

// ============================================
// Position API Types
// ============================================

export interface ApiPositionItem {
  poolAddress: string;
  positionAddress: string;
  nftMintAddress: string;
  upperTick: number;
  lowerTick: number;
  status: number;
  liquidityUsd?: string;
  earnedUsd?: string;
  earnedUsdPercent?: string;
  pnlUsd?: string;
  pnlUsdPercent?: string;
  apr?: string;
  bonusUsd?: string;
}

export interface ApiPositionListResponse {
  retCode: number;
  retMsg: string;
  result: {
    success: boolean;
    version: string;
    timestamp: number;
    ret_code: number;
    ret_msg: string | null;
    data: {
      total: number;
      pageNum?: number;
      pageSize?: number;
      positions?: ApiPositionItem[];
      records?: ApiPositionItem[];
      poolMap?: Record<
        string,
        {
          mintA?: { symbol?: string; decimals?: number; address?: string };
          mintB?: { symbol?: string; decimals?: number; address?: string };
        }
      >;
    };
  };
  retExtInfo: Record<string, unknown>;
  time: number;
}

// ============================================
// Top Positions API Types
// ============================================

export interface ApiTopPositionItem {
  poolAddress: string;
  positionAddress: string;
  nftMintAddress: string;
  upperTick: number;
  lowerTick: number;
  walletAddress: string;
  status: number;
  liquidityUsd?: string;
  earnedUsd?: string;
  earnedUsdPercent?: string;
  pnlUsd?: string;
  pnlUsdPercent?: string;
  bonusUsd?: string;
  copies?: number;
  positionAgeMs?: number;
  totalDeposit?: string;
  totalClaimedFeesRewards?: string;
}

export interface ApiTopPositionsResponse {
  retCode: number;
  retMsg: string;
  result: {
    success: boolean;
    version: string;
    timestamp: number;
    ret_code: number;
    ret_msg: string | null;
    data: {
      records: ApiTopPositionItem[];
      poolMap?: Record<
        string,
        {
          mintA?: { symbol?: string; address?: string };
          mintB?: { symbol?: string; address?: string };
        }
      >;
      total: number;
      pageNum: number;
      pageSize: number;
    };
  };
  retExtInfo: Record<string, unknown>;
  time: number;
}

// ============================================
// Fee Encode API Types
// ============================================

export interface ApiFeeEncodeEntry {
  positionAddress: string;
  txPayload: string;
  tokens: {
    tokenAddress: string;
    tokenAmount: string;
    tokenDecimals: number;
    tokenSymbol: string;
  }[];
}
