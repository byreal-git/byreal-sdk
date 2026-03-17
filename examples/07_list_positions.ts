/**
 * List user's liquidity positions (requires SOL_SECRET_KEY)
 *
 * Usage:
 *   SOL_SECRET_KEY=<base58-key> npx tsx examples/07_list_positions.ts
 */

import { sdk, requireUserAddress } from "./config.js";

async function main(): Promise<void> {
  const userPubkey = requireUserAddress();
  console.log(`User: ${userPubkey.toBase58()}\n`);

  // List active positions
  const result = await sdk.positions.list({
    userAddress: userPubkey.toBase58(),
    status: 0, // 0 = active
    pageSize: 20,
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  console.log(`Total active positions: ${result.value.total}\n`);

  for (const pos of result.value.positions) {
    console.log(`${pos.pair || pos.poolAddress}`);
    console.log(`  Position:    ${pos.positionAddress}`);
    console.log(`  NFT Mint:    ${pos.nftMintAddress}`);
    console.log(`  Pool:        ${pos.poolAddress}`);
    console.log(`  Tick Range:  ${pos.tickLower} - ${pos.tickUpper}`);
    console.log(`  Liquidity:   $${pos.liquidityUsd ?? "N/A"}`);
    console.log(`  Earned:      $${pos.earnedUsd ?? "N/A"} (${pos.earnedUsdPercent ?? "N/A"}%)`);
    console.log(`  PnL:         $${pos.pnlUsd ?? "N/A"} (${pos.pnlUsdPercent ?? "N/A"}%)`);
    console.log(`  APR:         ${pos.apr ?? "N/A"}%`);
    console.log();
  }
}

main();
