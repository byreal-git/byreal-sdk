// ============================================
// Staking (bbSOL) Types
// ============================================

export interface BbsolStats {
  totalStaked: string;
  apy: string;
  exchangeRate: string;
  [key: string]: unknown;
}

export interface SendBbsolTxParams {
  transactions: string[];
}
