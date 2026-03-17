// ============================================
// K-Line Types
// ============================================

export type KlineInterval = "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "4h" | "12h" | "1d";

export interface Kline {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface KlineParams {
  tokenAddress: string;
  poolAddress: string;
  klineType: KlineInterval;
  startTime?: number;
  endTime?: number;
}
