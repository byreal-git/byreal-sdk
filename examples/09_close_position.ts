/**
 * Close a position — remove all liquidity (requires SOL_SECRET_KEY)
 *
 * Replace NFT_MINT below with your actual position NFT mint address.
 *
 * Usage:
 *   SOL_SECRET_KEY=<base58-key> npx tsx examples/09_close_position.ts
 */

import { sdk, requireUserAddress, signerCallback } from "./config.js";

// ← Replace with your position's NFT mint address
const NFT_MINT = "YOUR_POSITION_NFT_MINT_ADDRESS";

async function main(): Promise<void> {
  if (NFT_MINT === "YOUR_POSITION_NFT_MINT_ADDRESS") {
    console.error("Please set NFT_MINT to your actual position NFT mint address");
    return;
  }

  const userPubkey = requireUserAddress();
  console.log(`User: ${userPubkey.toBase58()}`);
  console.log(`NFT Mint: ${NFT_MINT}\n`);

  const result = await sdk.positions.closePosition({
    nftMint: NFT_MINT,
    userAddress: userPubkey.toBase58(),
    slippageBps: 200,
    signerCallback,
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  console.log("Position Closed!");
  console.log(`  Signature: ${result.value.signature}`);
  console.log(`  Confirmed: ${result.value.confirmed}`);
}

main();
