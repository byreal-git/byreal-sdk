import type { TokenInfo } from "./token.js";

// ============================================
// Pool Types
// ============================================

export interface Pool {
  id: string;
  pair: string;
  token_a: TokenInfo;
  token_b: TokenInfo;
  tvl_usd: number;
  volume_24h_usd: number;
  volume_7d_usd: number;
  fee_rate_bps: number;
  fee_24h_usd: number;
  apr: number;
  current_price: number;
  created_at: string;
  price_change_1h?: number;
  price_change_24h?: number;
  price_change_7d?: number;
}

export interface PoolReward {
  mint: string;
  symbol: string;
  rewardPerSecond: string;
  openTime: number;
  endTime: number;
}

export interface PoolDetail extends Pool {
  price_range_24h: {
    low: number;
    high: number;
  };
  price_change_1h?: number;
  price_change_24h?: number;
  price_change_7d?: number;
  fee_7d_usd?: number;
  category?: number;
  rewards?: PoolReward[];
}

// ============================================
// Pool Query Parameters
// ============================================

export type PoolSortField = "tvl" | "volumeUsd24h" | "feeUsd24h" | "apr24h";

export type PoolCategory = 1 | 2 | 4 | 16;

export interface PoolListParams {
  page?: number;
  pageSize?: number;
  sortField?: PoolSortField;
  sortType?: "asc" | "desc";
  category?: string;
  status?: number;
  poolAddress?: string;
}
