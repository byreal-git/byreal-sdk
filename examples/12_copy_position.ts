/**
 * Copy a top-performing position (requires SOL_SECRET_KEY)
 *
 * Replace SOURCE_POSITION below with the position address you want to copy.
 *
 * Usage:
 *   SOL_SECRET_KEY=<base58-key> npx tsx examples/12_copy_position.ts
 */

import { sdk, requireUserAddress, signerCallback } from "./config.js";

// ← Replace with the position address you want to copy
const SOURCE_POSITION = "YOUR_SOURCE_POSITION_ADDRESS";

async function main(): Promise<void> {
  if (SOURCE_POSITION === "YOUR_SOURCE_POSITION_ADDRESS") {
    console.error("Please set SOURCE_POSITION to the position address you want to copy");
    return;
  }

  const userPubkey = requireUserAddress();
  console.log(`User: ${userPubkey.toBase58()}`);
  console.log(`Copying position: ${SOURCE_POSITION}`);
  console.log(`Investment: $5 USD\n`);

  const result = await sdk.copyFarmer.copyPosition({
    sourcePositionAddress: SOURCE_POSITION,
    amountUsd: 5,
    userAddress: userPubkey.toBase58(),
    slippageBps: 200,
    signerCallback,
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  console.log("Position Copied!");
  console.log(`  Signature:   ${result.value.signature}`);
  console.log(`  Confirmed:   ${result.value.confirmed}`);
  console.log(`  NFT Address: ${result.value.nftAddress ?? "N/A"}`);
}

main();
