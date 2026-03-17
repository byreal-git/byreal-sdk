/**
 * List tokens with search and sorting
 */

import { sdk } from "./config.js";

async function main(): Promise<void> {
  // List top tokens by volume
  console.log("=== Top Tokens by Volume ===\n");

  const result = await sdk.tokens.list({
    pageSize: 10,
    sortField: "volumeUsd24h",
    sort: "desc",
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  for (const token of result.value.items) {
    console.log(`${token.symbol} (${token.name})`);
    console.log(`  Mint:         ${token.mint}`);
    console.log(`  Price:        $${token.price_usd}`);
    console.log(`  Change 24h:   ${(token.price_change_24h * 100).toFixed(2)}%`);
    console.log(`  Volume 24h:   $${token.volume_24h_usd.toLocaleString()}`);
    console.log();
  }

  // Search for a specific token
  console.log('\n=== Search: "SOL" ===\n');

  const searchResult = await sdk.tokens.list({
    searchKey: "SOL",
    pageSize: 5,
  });

  if (searchResult.ok) {
    for (const token of searchResult.value.items) {
      console.log(`${token.symbol} — $${token.price_usd} (${token.mint})`);
    }
  }
}

main();
