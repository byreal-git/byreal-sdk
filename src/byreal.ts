import type { Connection } from "@solana/web3.js";
import { Chain, BYREAL_CLMM_PROGRAM_ID } from "@byreal-io/byreal-clmm-sdk";
import { ApiClient } from "./api/client.js";
import type { ByrealSDKConfig, ByrealContext } from "./types/config.js";
import { PoolService } from "./services/pool.service.js";
import { TokenService } from "./services/token.service.js";
import { OverviewService } from "./services/overview.service.js";
import { SwapService } from "./services/swap.service.js";
import { PositionService } from "./services/position.service.js";
import { FeeService } from "./services/fee.service.js";
import { CopyFarmerService } from "./services/copyfarmer.service.js";

// ============================================
// SDK Options
// ============================================

export interface ByrealSDKOptions {
  /** Solana RPC connection */
  connection: Connection;
  /** SDK configuration overrides */
  config?: ByrealSDKConfig;
}

// ============================================
// ByrealSDK Facade
// ============================================

export class ByrealSDK {
  /** Pool queries and k-line data */
  public readonly pools: PoolService;
  /** Token queries and price lookup */
  public readonly tokens: TokenService;
  /** Global DEX overview statistics */
  public readonly overview: OverviewService;
  /** Swap quotes and execution */
  public readonly swap: SwapService;
  /** Position lifecycle: open, close, claim, list */
  public readonly positions: PositionService;
  /** Priority fee and Jito tip queries */
  public readonly fees: FeeService;
  /** Copy farming: top positions, copy position */
  public readonly copyFarmer: CopyFarmerService;

  /** Low-level API client for direct endpoint access */
  public readonly apiClient: ApiClient;
  /** CLMM SDK Chain instance for on-chain operations */
  public readonly clmmChain: Chain;
  /** Solana connection */
  public readonly connection: Connection;

  constructor(options: ByrealSDKOptions) {
    const config: Required<ByrealSDKConfig> = {
      apiBaseUrl: options.config?.apiBaseUrl ?? "https://api2.byreal.io",
      apiTimeout: options.config?.apiTimeout ?? 30000,
      defaultSlippageBps: options.config?.defaultSlippageBps ?? 200,
      defaultPriorityFeeMicroLamports: options.config?.defaultPriorityFeeMicroLamports ?? 50000,
      debug: options.config?.debug ?? false,
    };

    this.connection = options.connection;

    this.apiClient = new ApiClient({
      baseUrl: config.apiBaseUrl,
      timeout: config.apiTimeout,
      debug: config.debug,
    });

    this.clmmChain = new Chain({
      connection: options.connection,
      programId: BYREAL_CLMM_PROGRAM_ID,
    });

    const ctx: ByrealContext = {
      connection: options.connection,
      apiClient: this.apiClient,
      clmmChain: this.clmmChain,
      config,
    };

    this.pools = new PoolService(ctx);
    this.tokens = new TokenService(ctx);
    this.overview = new OverviewService(ctx);
    this.swap = new SwapService(ctx);
    this.positions = new PositionService(ctx);
    this.fees = new FeeService(ctx);
    this.copyFarmer = new CopyFarmerService(ctx);
  }
}
