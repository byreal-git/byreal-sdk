/**
 * List pools sorted by TVL
 */

import { sdk } from "./config.js";

async function main(): Promise<void> {
  const result = await sdk.pools.list({
    pageSize: 10,
    sortField: "tvl",
    sortType: "desc",
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  console.log(`Total pools: ${result.value.total}`);
  console.log(`Page: ${result.value.page}, PageSize: ${result.value.pageSize}\n`);

  for (const pool of result.value.items) {
    console.log(`${pool.pair}`);
    console.log(`  Address:    ${pool.id}`);
    console.log(`  TVL:        $${pool.tvl_usd.toLocaleString()}`);
    console.log(`  Volume 24h: $${pool.volume_24h_usd.toLocaleString()}`);
    console.log(`  Fee 24h:    $${pool.fee_24h_usd.toLocaleString()}`);
    console.log(`  APR:        ${pool.apr.toFixed(2)}%`);
    console.log(`  Fee Rate:   ${pool.fee_rate_bps} bps`);
    console.log();
  }
}

main();
