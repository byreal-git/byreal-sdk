// ============================================
// Token Types
// ============================================

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logo_uri?: string;
  price_usd?: number;
}

export interface Token extends TokenInfo {
  price_usd: number;
  price_change_24h: number;
  volume_24h_usd: number;
  market_cap_usd?: number;
}

// ============================================
// Token Query Parameters
// ============================================

export type TokenSortField = "tvl" | "volumeUsd24h" | "price" | "priceChange24h" | "apr24h";

export interface TokenListParams {
  page?: number;
  pageSize?: number;
  sortField?: TokenSortField;
  sort?: "asc" | "desc";
  searchKey?: string;
  category?: string;
  status?: number;
}
