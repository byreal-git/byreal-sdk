/**
 * Get detailed information for a specific pool
 */

import { sdk, PoolAddress } from "./config.js";

async function main(): Promise<void> {
  const poolAddress = PoolAddress.USDC_USDT.toBase58();
  console.log("Pool address:", poolAddress);

  const result = await sdk.pools.getDetail(poolAddress);

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  const pool = result.value;

  console.log(`\nPool: ${pool.pair}`);
  console.log(`  TVL:            $${pool.tvl_usd.toLocaleString()}`);
  console.log(`  Current Price:  ${pool.current_price}`);
  console.log(`  Fee Rate:       ${pool.fee_rate_bps} bps`);
  console.log(`  APR:            ${pool.apr.toFixed(2)}%`);
  console.log(`  Volume 24h:     $${pool.volume_24h_usd.toLocaleString()}`);
  console.log(`  Volume 7d:      $${pool.volume_7d_usd.toLocaleString()}`);
  console.log(`  Fee 24h:        $${pool.fee_24h_usd.toLocaleString()}`);
  console.log(`  Fee 7d:         $${pool.fee_7d_usd?.toLocaleString() ?? "N/A"}`);

  console.log(`\n  Token A: ${pool.token_a.symbol}`);
  console.log(`    Mint:     ${pool.token_a.mint}`);
  console.log(`    Decimals: ${pool.token_a.decimals}`);
  console.log(`    Price:    $${pool.token_a.price_usd}`);

  console.log(`\n  Token B: ${pool.token_b.symbol}`);
  console.log(`    Mint:     ${pool.token_b.mint}`);
  console.log(`    Decimals: ${pool.token_b.decimals}`);
  console.log(`    Price:    $${pool.token_b.price_usd}`);

  if (pool.price_range_24h) {
    console.log(`\n  24h Price Range: ${pool.price_range_24h.low} - ${pool.price_range_24h.high}`);
  }

  if (pool.rewards && pool.rewards.length > 0) {
    console.log(`\n  Rewards:`);
    for (const reward of pool.rewards) {
      console.log(`    ${reward.symbol}: ${reward.rewardPerSecond}/s`);
    }
  }
}

main();
