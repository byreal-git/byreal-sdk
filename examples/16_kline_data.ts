/**
 * Get K-line (candlestick) data for a pool
 */

import { sdk, PoolAddress, TokenAddress } from "./config.js";

async function main(): Promise<void> {
  const poolAddress = PoolAddress.SOL_USDC.toBase58();
  const tokenAddress = TokenAddress.SOL.toBase58();

  console.log(`Pool: ${poolAddress}`);
  console.log(`Token: ${tokenAddress}`);
  console.log(`Interval: 1h\n`);

  const result = await sdk.pools.getKlines({
    poolAddress,
    tokenAddress,
    klineType: "1h",
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  console.log(`Received ${result.value.length} candles\n`);

  // Show the last 10 candles
  const candles = result.value.slice(-10);
  console.log("Last 10 candles:");
  console.log(
    "  Time                  | Open       | High       | Low        | Close      | Volume",
  );
  console.log("  " + "-".repeat(95));

  for (const k of candles) {
    const time = new Date(k.timestamp).toISOString().slice(0, 19);
    console.log(
      `  ${time} | ${k.open.toFixed(4).padStart(10)} | ${k.high.toFixed(4).padStart(10)} | ${k.low.toFixed(4).padStart(10)} | ${k.close.toFixed(4).padStart(10)} | ${k.volume.toFixed(2)}`,
    );
  }
}

main();
