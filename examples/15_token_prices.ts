/**
 * Batch fetch token prices
 */

import { sdk, TokenAddress } from "./config.js";

async function main(): Promise<void> {
  const mints = [
    TokenAddress.SOL.toBase58(),
    TokenAddress.USDC.toBase58(),
    TokenAddress.USDT.toBase58(),
    TokenAddress.BBSOL.toBase58(),
  ];

  console.log(`Fetching prices for ${mints.length} tokens...\n`);

  const result = await sdk.tokens.getPrices(mints);

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  const names: Record<string, string> = {
    [TokenAddress.SOL.toBase58()]: "SOL",
    [TokenAddress.USDC.toBase58()]: "USDC",
    [TokenAddress.USDT.toBase58()]: "USDT",
    [TokenAddress.BBSOL.toBase58()]: "BBSOL",
  };

  for (const [mint, price] of Object.entries(result.value)) {
    console.log(`  ${names[mint] || mint}: $${price}`);
  }
}

main();
