// ============================================
// Order Types
// ============================================

export interface OrderListParams {
  userAddress: string;
  page?: number;
  pageSize?: number;
}

export interface OrderItem {
  orderId: string;
  userAddress: string;
  type: string;
  status: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  createdAt: number;
  txSignature?: string;
}

export interface OrderListResult {
  orders: OrderItem[];
  total: number;
}
