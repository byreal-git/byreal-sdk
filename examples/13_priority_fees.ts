/**
 * Get current priority fee recommendations
 */

import { sdk } from "./config.js";

async function main(): Promise<void> {
  console.log("=== Priority Fees ===\n");

  const feeResult = await sdk.fees.getAutoFee();

  if (!feeResult.ok) {
    console.error("Error:", feeResult.error.message);
    return;
  }

  console.log(`  Medium:  ${feeResult.value.medium} micro-lamports/CU`);
  console.log(`  High:    ${feeResult.value.high} micro-lamports/CU`);
  console.log(`  Extreme: ${feeResult.value.extreme} micro-lamports/CU`);

  console.log("\n=== Jito Tip ===\n");

  const jitoResult = await sdk.fees.getJitoTip();

  if (!jitoResult.ok) {
    console.error("Error:", jitoResult.error.message);
    return;
  }

  console.log(jitoResult.value);
}

main();
