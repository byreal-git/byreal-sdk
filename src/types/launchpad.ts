// ============================================
// Launchpad Types
// ============================================

export interface AuctionInfo {
  auctionAddress: string;
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  tokenLogoUri: string;
  quoteMint: string;
  quoteSymbol: string;
  quoteDecimals: number;
  startTime: number;
  endTime: number;
  status: string;
  totalSupply: string;
  committedAmount: string;
  price: string;
  minCommit: string;
  maxCommit: string;
}

export interface AuctionListItem {
  auctionAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoUri: string;
  status: string;
  startTime: number;
  endTime: number;
  totalSupply: string;
  committedAmount: string;
}

export interface WhitelistSignResult {
  signature: string;
  nonce: number;
}

export interface UserCommitStatus {
  committed: boolean;
  amount: string;
  claimable: boolean;
}

export interface LaunchpadStatistics {
  totalAuctions: number;
  totalRaised: string;
  totalParticipants: number;
}

export interface SendLaunchpadOrderParams {
  auctionAddress: string;
  transactions: string[];
}
