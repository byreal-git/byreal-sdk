/**
 * Utility: Calculate tick-aligned price ranges for a pool
 */

import { sdk, PoolAddress } from "./config.js";
import {
  calculateTickAlignedPriceRange,
  calculatePriceRangeFromTickSpacing,
} from "../src/index.js";

async function main(): Promise<void> {
  const poolAddress = PoolAddress.USDC_USDT.toBase58();
  console.log(`Pool: ${poolAddress}\n`);

  // Get on-chain pool info for tick spacing and decimals
  const poolInfo = await sdk.clmmChain.getRawPoolInfoByPoolId(poolAddress);

  console.log(`Tick Spacing: ${poolInfo.tickSpacing}`);
  console.log(`Decimals A:   ${poolInfo.mintDecimalsA}`);
  console.log(`Decimals B:   ${poolInfo.mintDecimalsB}`);

  // Calculate full price range for this pool
  const fullRange = calculatePriceRangeFromTickSpacing(
    poolInfo.tickSpacing,
    poolInfo.mintDecimalsA,
    poolInfo.mintDecimalsB,
  );

  console.log(`\nFull Price Range:`);
  console.log(`  Min: ${fullRange.min.price} (tick: ${fullRange.min.tick})`);
  console.log(`  Max: ${fullRange.max.price} (tick: ${fullRange.max.tick})`);

  // Align user-specified prices to valid ticks
  const userPriceLower = "0.998";
  const userPriceUpper = "1.002";

  console.log(`\nUser Input: ${userPriceLower} - ${userPriceUpper}`);

  const { priceInTickLower, priceInTickUpper } = calculateTickAlignedPriceRange({
    tickSpacing: poolInfo.tickSpacing,
    mintDecimalsA: poolInfo.mintDecimalsA,
    mintDecimalsB: poolInfo.mintDecimalsB,
    startPrice: userPriceLower,
    endPrice: userPriceUpper,
  });

  console.log(`\nTick-Aligned Result:`);
  console.log(`  Lower: price=${priceInTickLower.price.toString()}, tick=${priceInTickLower.tick}`);
  console.log(`  Upper: price=${priceInTickUpper.price.toString()}, tick=${priceInTickUpper.tick}`);
}

main();
