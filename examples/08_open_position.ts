/**
 * Open a new CLMM position (requires SOL_SECRET_KEY)
 *
 * This example opens a position on the USDC/USDT pool with $1 USD investment.
 *
 * Usage:
 *   SOL_SECRET_KEY=<base58-key> npx tsx examples/08_open_position.ts
 */

import { sdk, requireUserAddress, signerCallback, PoolAddress } from "./config.js";

async function main(): Promise<void> {
  const userPubkey = requireUserAddress();
  const poolAddress = PoolAddress.USDC_USDT.toBase58();

  console.log(`User: ${userPubkey.toBase58()}`);
  console.log(`Pool: ${poolAddress}`);
  console.log(`Investment: $1 USD\n`);

  // Open position with USD amount — SDK auto-calculates token split
  const result = await sdk.positions.openPosition({
    poolAddress,
    priceLower: "0.998",
    priceUpper: "1.002",
    amountUsd: 1,
    userAddress: userPubkey.toBase58(),
    slippageBps: 200,
    signerCallback,
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    if (result.error.details) {
      console.error("Details:", result.error.details);
    }
    return;
  }

  console.log("Position Opened!");
  console.log(`  Signature:   ${result.value.signature}`);
  console.log(`  Confirmed:   ${result.value.confirmed}`);
  console.log(`  NFT Address: ${result.value.nftAddress ?? "N/A"}`);
}

main();
