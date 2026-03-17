export const API_ENDPOINTS = {
  // Pool endpoints
  POOLS_LIST: "/byreal/api/dex/v2/pools/info/list",
  POOL_DETAILS: "/byreal/api/dex/v2/pools/details",
  POOLS_BATCH: "/byreal/api/dex/v2/pools/info/batch",

  // Token endpoints
  TOKENS_LIST: "/byreal/api/dex/v2/mint/list",
  TOKEN_PRICE: "/byreal/api/dex/v2/mint/price",
  TOKENS_BY_IDS: "/byreal/api/dex/v2/mint/ids",
  TOKEN_MULTIPLIER: "/byreal/api/dex/v2/mint/multiplier",

  // Overview
  OVERVIEW_GLOBAL: "/byreal/api/dex/v2/overview/global",

  // Kline
  POOL_KLINES: "/byreal/api/dex/v2/kline/query-ui",

  // Swap / Router
  SWAP_QUOTE: "/byreal/api/router/v1/router-service/swap",
  SWAP_EXECUTE_AMM: "/byreal/api/dex/v2/send-swap-tx",
  LIQUIDITY_SEND: "/byreal/api/dex/v2/liquidity/send",

  // RFQ
  RFQ_QUOTE: "/byreal/api/rfq/v1/quote",
  RFQ_SWAP: "/byreal/api/rfq/v1/swap",
  RFQ_TOKENS: "/byreal/api/rfq/v1/tokens",

  // Position endpoints
  POSITIONS_LIST: "/byreal/api/dex/v2/position/list",
  POSITION_DETAIL: "/byreal/api/dex/v2/position/detail",
  POSITION_OVERVIEW: "/byreal/api/dex/v2/position/overview",
  POSITION_UNCLAIMED: "/byreal/api/dex/v2/position/unclaimed-data",
  POSITION_UNCLAIMED_V2: "/byreal/api/dex/v2/position/unclaimed-v2",

  // Incentive / Fees
  FEE_ENCODE: "/byreal/api/dex/v2/incentive/encode-fee",
  INCENTIVE_ENCODE_V2: "/byreal/api/dex/v2/incentive/encode-v2",
  INCENTIVE_ENCODE_V3: "/byreal/api/dex/v2/incentive/encode-v3",
  INCENTIVE_ORDER_V2: "/byreal/api/dex/v2/incentive/order-v2",
  INCENTIVE_ORDER_V3: "/byreal/api/dex/v2/incentive/order-v3",

  // Copy Farmer
  COPYFARMER_TOP_POSITIONS: "/byreal/api/dex/v2/copyfarmer/top-positions",
  COPYFARMER_OVERVIEW: "/byreal/api/dex/v2/copyfarmer/overview",
  COPYFARMER_TOP_FARMERS: "/byreal/api/dex/v2/copyfarmer/top-farmers",
  COPYFARMER_PROVIDER_OVERVIEW: "/byreal/api/dex/v2/copyfarmer/providerOverview",
  COPYFARMER_EPOCH_BONUS: "/byreal/api/dex/v2/copyfarmer/epoch-bonus",

  // Orders
  ORDER_LIST: "/byreal/api/dex/v2/order/list",

  // Fee / Config
  AUTO_FEE: "/byreal/api/dex/v2/main/auto-fee",
  JITO_TIP: "/byreal/api/dex/v2/main/jito-tip",
  FRONTEND_CONFIG: "/byreal/api/dex/v2/main/config",

  // Staking (bbSOL)
  BBSOL_TX: "/byreal/api/dex/v2/send-bbsol-tx",
  BBSOL_STATS: "/byreal/api/dex/v2/main/staking/bbsol/stats",

  // Launchpad
  LAUNCHPAD_AUCTION: "/byreal/api/dex/v2/launchpad/auction",
  LAUNCHPAD_LIST: "/byreal/api/dex/v2/launchpad/list",
  LAUNCHPAD_WHITELIST_CHECK: "/byreal/api/dex/v2/launchpad/check/whitelist",
  LAUNCHPAD_WHITELIST_SIGN: "/byreal/api/dex/v2/launchpad/whitelist/sign",
  LAUNCHPAD_COMMIT_STATUS: "/byreal/api/dex/v2/launchpad/user/commit/status",
  LAUNCHPAD_SEND_ORDER: "/byreal/api/dex/v2/launchpad/send/order",
  LAUNCHPAD_STATISTICS: "/byreal/api/dex/v2/launchpad/statistic",

  // Onchain API
  ONCHAIN_POOL_DETAIL: "/byreal/api/onchain/v2/pool/detail",
  ONCHAIN_POSITION_LIST: "/byreal/api/onchain/v2/position/list",
  ONCHAIN_MINT_LIST: "/byreal/api/onchain/v2/mint/list",
} as const;
