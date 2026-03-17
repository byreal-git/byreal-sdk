// ============================================
// Main Entry — @byreal-io/byreal-sdk
// ============================================

// Facade
export { ByrealSDK } from "./byreal.js";
export type { ByrealSDKOptions } from "./byreal.js";

// Types
export * from "./types/index.js";

// Errors
export { ByrealError, ErrorCodes } from "./errors/index.js";
export type { ErrorCode, ErrorType } from "./errors/index.js";

// Services (for direct access if needed)
export {
  PoolService,
  TokenService,
  OverviewService,
  SwapService,
  PositionService,
  FeeService,
  CopyFarmerService,
} from "./services/index.js";

// Low-level API client
export { ApiClient } from "./api/client.js";
export type { ApiClientConfig } from "./api/client.js";
export { API_ENDPOINTS } from "./api/endpoints.js";

// Re-export CLMM SDK essentials
export { Chain, BYREAL_CLMM_PROGRAM_ID } from "@byreal-io/byreal-clmm-sdk";

// Utility functions
export { uiToRaw, rawToUi } from "./utils/amounts.js";
export {
  calculateTickAlignedPriceRange,
  calculatePriceFromTick,
  calculatePriceRangeFromTickSpacing,
  calculateTokenAmountsFromUsd,
} from "./utils/calculate.js";
export {
  deserializeTransaction,
  serializeTransaction,
  sendAndConfirmTx,
} from "./utils/transaction.js";
