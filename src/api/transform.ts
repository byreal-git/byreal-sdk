import type { Pool, PoolDetail } from "../types/pool.js";
import type { Token } from "../types/token.js";
import type { GlobalOverview } from "../types/overview.js";
import type { Kline } from "../types/kline.js";
import type {
  ApiSimplePoolInfo,
  ApiMintItem,
  ApiOverviewGlobalDTO,
  ApiKlineData,
} from "./api-types.js";

// ============================================
// Transform Functions
// ============================================

export function transformPool(apiPool: ApiSimplePoolInfo): Pool {
  const mintA = apiPool.mintA?.mintInfo || ({} as Record<string, unknown>);
  const mintB = apiPool.mintB?.mintInfo || ({} as Record<string, unknown>);

  const baseMintPrice = parseFloat(apiPool.baseMint?.price || apiPool.mintA?.price || "0");
  const quoteMintPrice = parseFloat(apiPool.quoteMint?.price || apiPool.mintB?.price || "0");
  const poolPrice = quoteMintPrice > 0 ? baseMintPrice / quoteMintPrice : 0;

  return {
    id: apiPool.poolAddress,
    pair: `${(mintA as any).symbol || "Unknown"}/${(mintB as any).symbol || "Unknown"}`,
    token_a: {
      mint: (mintA as any).address || "",
      symbol: (mintA as any).symbol || "",
      name: (mintA as any).name || "",
      decimals: (mintA as any).decimals || 0,
      logo_uri: (mintA as any).logoURI || "",
      price_usd: parseFloat(apiPool.baseMint?.price || apiPool.mintA?.price || "0"),
    },
    token_b: {
      mint: (mintB as any).address || "",
      symbol: (mintB as any).symbol || "",
      name: (mintB as any).name || "",
      decimals: (mintB as any).decimals || 0,
      logo_uri: (mintB as any).logoURI || "",
      price_usd: parseFloat(apiPool.quoteMint?.price || apiPool.mintB?.price || "0"),
    },
    tvl_usd: parseFloat(apiPool.tvl || "0"),
    volume_24h_usd: parseFloat(apiPool.volumeUsd1d || apiPool.volumeUsd24h || "0"),
    volume_7d_usd: parseFloat(apiPool.volumeUsd7d || "0"),
    fee_rate_bps: parseInt(apiPool.feeRate?.fixFeeRate || "0", 10) / 100,
    fee_24h_usd: parseFloat(apiPool.feeUsd1d || apiPool.feeUsd24h || "0"),
    apr: parseFloat(apiPool.feeApr24h || "0") * 100,
    current_price: poolPrice,
    created_at: apiPool.openTime ? new Date(apiPool.openTime).toISOString() : "",
    price_change_1h: apiPool.priceChange1h ? parseFloat(apiPool.priceChange1h) * 100 : undefined,
    price_change_24h: apiPool.priceChange1d ? parseFloat(apiPool.priceChange1d) * 100 : undefined,
    price_change_7d: apiPool.priceChange7d ? parseFloat(apiPool.priceChange7d) * 100 : undefined,
  };
}

export function transformPoolDetail(apiPool: ApiSimplePoolInfo): PoolDetail {
  const pool = transformPool(apiPool);

  const rewards = (apiPool.rewards || []).map((r) => ({
    mint: r.mint?.address || "",
    symbol: r.mint?.symbol || "",
    rewardPerSecond: r.rewardPerSecond || "0",
    openTime: r.rewardOpenTime || 0,
    endTime: r.rewardEndTime || 0,
  }));

  return {
    ...pool,
    price_range_24h: {
      low: parseFloat(apiPool.dayPriceRange?.lowPrice || "0"),
      high: parseFloat(apiPool.dayPriceRange?.highPrice || "0"),
    },
    price_change_1h: parseFloat(apiPool.priceChange1h || "0") * 100,
    price_change_24h: parseFloat(apiPool.priceChange1d || "0") * 100,
    price_change_7d: parseFloat(apiPool.priceChange7d || "0") * 100,
    fee_7d_usd: parseFloat(apiPool.feeUsd7d || "0"),
    category: apiPool.category,
    rewards: rewards.length > 0 ? rewards : undefined,
  };
}

export function transformToken(apiToken: ApiMintItem): Token {
  return {
    mint: apiToken.address,
    symbol: apiToken.symbol,
    name: apiToken.name,
    decimals: apiToken.decimals,
    logo_uri: apiToken.logoURI,
    price_usd: parseFloat(apiToken.price || "0"),
    price_change_24h: parseFloat(apiToken.priceChange24h || "0"),
    volume_24h_usd: parseFloat(apiToken.volumeUsd24h || "0"),
    market_cap_usd: undefined,
  };
}

export function transformOverview(data: ApiOverviewGlobalDTO): GlobalOverview {
  return {
    tvl: parseFloat(data.tvl || "0"),
    tvl_change_24h: parseFloat(data.tvlChange || "0"),
    volume_24h_usd: parseFloat(data.volumeUsd24h || "0"),
    volume_change_24h: parseFloat(data.volumeUsd24hChange || "0"),
    volume_all: parseFloat(data.volumeAll || "0"),
    fee_24h_usd: parseFloat(data.feeUsd24h || "0"),
    fee_change_24h: parseFloat(data.feeUsd24hChange || "0"),
    fee_all: parseFloat(data.feeAll || "0"),
    pools_count: 0,
  };
}

export function transformKline(apiKline: ApiKlineData): Kline {
  return {
    timestamp: typeof apiKline.t === "string" ? parseInt(apiKline.t, 10) : apiKline.t,
    open: parseFloat(apiKline.o || "0"),
    high: parseFloat(apiKline.h || "0"),
    low: parseFloat(apiKline.l || "0"),
    close: parseFloat(apiKline.c || "0"),
    volume: parseFloat(apiKline.v || "0"),
  };
}
