/**
 * Get top-performing positions for a pool (Copy Farming)
 */

import { sdk, PoolAddress } from "./config.js";

async function main(): Promise<void> {
  const poolAddress = PoolAddress.XAUT0_USDT.toBase58();
  console.log(`Pool: ${poolAddress}\n`);

  const result = await sdk.copyFarmer.getTopPositions({
    poolAddress,
    sortField: "liquidity",
    sortType: "desc",
    pageSize: 10,
    status: 0, // active only
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  console.log(`Top ${result.value.positions.length} positions (of ${result.value.total}):\n`);

  for (const pos of result.value.positions) {
    console.log(`${pos.pair || pos.poolAddress}`);
    console.log(`  Position:    ${pos.positionAddress}`);
    console.log(`  Wallet:      ${pos.walletAddress}`);
    console.log(`  Tick Range:  ${pos.tickLower} - ${pos.tickUpper}`);
    console.log(`  Liquidity:   $${pos.liquidityUsd}`);
    console.log(`  Earned:      $${pos.earnedUsd} (${pos.earnedUsdPercent}%)`);
    console.log(`  PnL:         $${pos.pnlUsd} (${pos.pnlUsdPercent}%)`);
    console.log(`  Bonus:       $${pos.bonusUsd}`);
    console.log(`  Copies:      ${pos.copies}`);
    console.log(`  Age:         ${Math.floor(pos.positionAgeMs / 86400000)}d`);
    console.log();
  }
}

main();
