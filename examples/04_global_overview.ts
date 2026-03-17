/**
 * Get global DEX overview statistics
 */

import { sdk } from "./config.js";

async function main(): Promise<void> {
  const result = await sdk.overview.getGlobal();

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  const overview = result.value;

  console.log("=== Byreal DEX Overview ===\n");
  console.log(`  TVL:              $${overview.tvl.toLocaleString()}`);
  console.log(`  TVL Change 24h:   ${(overview.tvl_change_24h * 100).toFixed(2)}%`);
  console.log(`  Volume 24h:       $${overview.volume_24h_usd.toLocaleString()}`);
  console.log(`  Volume Change 24h:${(overview.volume_change_24h * 100).toFixed(2)}%`);
  console.log(`  Volume All-time:  $${overview.volume_all.toLocaleString()}`);
  console.log(`  Fees 24h:         $${overview.fee_24h_usd.toLocaleString()}`);
  console.log(`  Fees Change 24h:  ${(overview.fee_change_24h * 100).toFixed(2)}%`);
  console.log(`  Fees All-time:    $${overview.fee_all.toLocaleString()}`);
  console.log(`  Total Pools:      ${overview.pools_count}`);
}

main();
