import type { Connection } from "@solana/web3.js";
import type { Chain } from "@byreal-io/byreal-clmm-sdk";
import type { ApiClient } from "../api/client.js";

// ============================================
// SDK Configuration
// ============================================

export interface ByrealSDKConfig {
  /** API base URL (default: 'https://api2.byreal.io') */
  apiBaseUrl?: string;
  /** API request timeout in ms (default: 30000) */
  apiTimeout?: number;
  /** Default slippage in basis points (default: 200) */
  defaultSlippageBps?: number;
  /** Default priority fee in micro-lamports (default: 50000) */
  defaultPriorityFeeMicroLamports?: number;
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

// ============================================
// Internal Context (shared across services)
// ============================================

export interface ByrealContext {
  connection: Connection;
  apiClient: ApiClient;
  clmmChain: Chain;
  config: Required<ByrealSDKConfig>;
}
