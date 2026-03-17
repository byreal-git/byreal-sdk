/**
 * Claim accumulated fees from positions (requires SOL_SECRET_KEY)
 *
 * Replace NFT_MINTS below with your actual position NFT mint addresses.
 *
 * Usage:
 *   SOL_SECRET_KEY=<base58-key> npx tsx examples/10_claim_fees.ts
 */

import { sdk, requireUserAddress, signerCallback } from "./config.js";

// ← Replace with your position NFT mint addresses
const NFT_MINTS = [
  "YOUR_POSITION_NFT_MINT_1",
  // 'YOUR_POSITION_NFT_MINT_2',
];

async function main(): Promise<void> {
  if (NFT_MINTS[0] === "YOUR_POSITION_NFT_MINT_1") {
    console.error("Please set NFT_MINTS to your actual position NFT mint addresses");
    return;
  }

  const userPubkey = requireUserAddress();
  console.log(`User: ${userPubkey.toBase58()}`);
  console.log(`Claiming fees for ${NFT_MINTS.length} position(s)\n`);

  const result = await sdk.positions.claimFees({
    nftMints: NFT_MINTS,
    userAddress: userPubkey.toBase58(),
    signerCallback,
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  console.log("Fees Claimed!");
  console.log(`  Signatures: ${result.value.signatures.join(", ")}`);
  console.log(`  Confirmed:  ${result.value.confirmed}`);
}

main();
