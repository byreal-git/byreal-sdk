// ============================================
// Error Codes
// ============================================

export const ErrorCodes = {
  // Validation errors
  INVALID_PARAMETER: "INVALID_PARAMETER",
  INVALID_RANGE: "INVALID_RANGE",
  MISSING_REQUIRED: "MISSING_REQUIRED",

  // Business errors
  POOL_NOT_FOUND: "POOL_NOT_FOUND",
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  SLIPPAGE_EXCEEDED: "SLIPPAGE_EXCEEDED",
  POSITION_NOT_FOUND: "POSITION_NOT_FOUND",
  PRICE_UNAVAILABLE: "PRICE_UNAVAILABLE",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  API_ERROR: "API_ERROR",
  TIMEOUT: "TIMEOUT",

  // System errors
  RPC_ERROR: "RPC_ERROR",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  TRANSACTION_TIMEOUT: "TRANSACTION_TIMEOUT",
  SDK_ERROR: "SDK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export type ErrorType = "VALIDATION" | "BUSINESS" | "NETWORK" | "SYSTEM";

// ============================================
// Error Class
// ============================================

export class ByrealError extends Error {
  code: ErrorCode;
  type: ErrorType;
  details?: Record<string, unknown>;
  retryable: boolean;

  constructor(options: {
    code: ErrorCode;
    type: ErrorType;
    message: string;
    details?: Record<string, unknown>;
    retryable?: boolean;
  }) {
    super(options.message);
    this.name = "ByrealError";
    this.code = options.code;
    this.type = options.type;
    this.details = options.details;
    this.retryable = options.retryable ?? false;
  }

  toJSON() {
    return {
      code: this.code,
      type: this.type,
      message: this.message,
      details: this.details,
      retryable: this.retryable,
    };
  }
}

// ============================================
// Error Factory Functions
// ============================================

export function poolNotFoundError(poolId: string): ByrealError {
  return new ByrealError({
    code: ErrorCodes.POOL_NOT_FOUND,
    type: "BUSINESS",
    message: `Pool not found: ${poolId}`,
    details: { pool_id: poolId },
    retryable: false,
  });
}

export function tokenNotFoundError(mint: string): ByrealError {
  return new ByrealError({
    code: ErrorCodes.TOKEN_NOT_FOUND,
    type: "BUSINESS",
    message: `Token not found: ${mint}`,
    details: { mint },
    retryable: false,
  });
}

export function networkError(message: string, details?: Record<string, unknown>): ByrealError {
  return new ByrealError({
    code: ErrorCodes.NETWORK_ERROR,
    type: "NETWORK",
    message: `Network error: ${message}`,
    details,
    retryable: true,
  });
}

export function apiError(message: string, statusCode?: number): ByrealError {
  return new ByrealError({
    code: ErrorCodes.API_ERROR,
    type: "NETWORK",
    message: `API error: ${message}`,
    details: statusCode ? { status_code: statusCode } : undefined,
    retryable: statusCode ? statusCode >= 500 : false,
  });
}

export function validationError(message: string, field?: string): ByrealError {
  return new ByrealError({
    code: ErrorCodes.INVALID_PARAMETER,
    type: "VALIDATION",
    message,
    details: field ? { field } : undefined,
    retryable: false,
  });
}

export function transactionError(message: string, signature?: string): ByrealError {
  return new ByrealError({
    code: ErrorCodes.TRANSACTION_FAILED,
    type: "SYSTEM",
    message: `Transaction failed: ${message}`,
    details: signature ? { signature } : undefined,
    retryable: false,
  });
}

export function transactionTimeoutError(signature?: string): ByrealError {
  return new ByrealError({
    code: ErrorCodes.TRANSACTION_TIMEOUT,
    type: "SYSTEM",
    message: "Transaction confirmation timed out",
    details: signature ? { signature } : undefined,
    retryable: true,
  });
}

export function sdkError(message: string, details?: Record<string, unknown>): ByrealError {
  return new ByrealError({
    code: ErrorCodes.SDK_ERROR,
    type: "SYSTEM",
    message: `SDK error: ${message}`,
    details,
    retryable: false,
  });
}

export function insufficientBalanceError(details?: Record<string, unknown>): ByrealError {
  return new ByrealError({
    code: ErrorCodes.INSUFFICIENT_BALANCE,
    type: "BUSINESS",
    message: "Insufficient balance for this operation",
    details,
    retryable: false,
  });
}

export function positionNotFoundError(nftMint: string): ByrealError {
  return new ByrealError({
    code: ErrorCodes.POSITION_NOT_FOUND,
    type: "BUSINESS",
    message: `Position not found: ${nftMint}`,
    details: { nft_mint: nftMint },
    retryable: false,
  });
}

export function priceUnavailableError(symbolA: string, symbolB: string): ByrealError {
  return new ByrealError({
    code: ErrorCodes.PRICE_UNAVAILABLE,
    type: "BUSINESS",
    message: `Token price unavailable for ${symbolA} or ${symbolB}`,
    details: { symbolA, symbolB },
    retryable: true,
  });
}
