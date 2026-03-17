// ============================================
// Overview Types
// ============================================

export interface GlobalOverview {
  tvl: number;
  tvl_change_24h: number;
  volume_24h_usd: number;
  volume_change_24h: number;
  volume_all: number;
  fee_24h_usd: number;
  fee_change_24h: number;
  fee_all: number;
  pools_count: number;
  active_positions?: number;
}
