// ============================================
// Fee / Incentive Types
// ============================================

export interface FeeEncodeParams {
  walletAddress: string;
  positionAddresses: string[];
}

export interface FeeEncodeEntry {
  positionAddress: string;
  txPayload: string;
  tokens: {
    tokenAddress: string;
    tokenAmount: string;
    tokenDecimals: number;
    tokenSymbol: string;
  }[];
}

export interface EncodeRewardParams {
  walletAddress: string;
  positionAddresses: string[];
}

export interface ClaimRewardParams {
  walletAddress: string;
  positionAddresses: string[];
  transactions: string[];
}
