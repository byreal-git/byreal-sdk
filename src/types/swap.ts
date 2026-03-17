// ============================================
// Swap Types
// ============================================

export interface SwapQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  swapMode: "in" | "out";
  slippageBps: number;
  userPublicKey?: string;
}

export interface SwapQuote {
  outAmount: string;
  inAmount: string;
  inputMint: string;
  outputMint: string;
  transaction: string;
  priceImpactPct?: string;
  routerType: string;
  orderId?: string;
  quoteId?: string;
  poolAddresses: string[];
}

export interface SwapAmmExecuteParams {
  preData: string[];
  data: string[];
  userSignTime: number;
}

export interface SwapRfqExecuteParams {
  quoteId: string;
  requestId: string;
  transaction: string;
}

export interface SwapExecuteParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  swapMode: "in" | "out";
  slippageBps?: number;
  userPublicKey: string;
  /** If true, amount is in raw (smallest unit) format */
  isRawAmount?: boolean;
}

export interface SwapResult {
  signatures: string[];
  confirmed: boolean;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  routerType: string;
}
