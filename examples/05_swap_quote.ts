/**
 * Get a swap quote (preview only, no execution)
 */

import { sdk, TokenAddress } from "./config.js";
import { uiToRaw, rawToUi } from "../src/index.js";

async function main(): Promise<void> {
  const inputMint = TokenAddress.SOL.toBase58();
  const outputMint = TokenAddress.USDC.toBase58();
  const uiAmount = "0.1"; // 0.1 SOL
  const rawAmount = uiToRaw(uiAmount, 9); // SOL has 9 decimals

  console.log(`Swap Quote: ${uiAmount} SOL → USDC`);
  console.log(`Raw amount: ${rawAmount}\n`);

  const result = await sdk.swap.getQuote({
    inputMint,
    outputMint,
    amount: rawAmount,
    swapMode: "in",
    slippageBps: 200,
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  const quote = result.value;
  const uiInAmount = rawToUi(quote.inAmount, 9); // SOL decimals
  const uiOutAmount = rawToUi(quote.outAmount, 6); // USDC decimals

  console.log("Quote Result:");
  console.log(`  Input:         ${uiInAmount} SOL`);
  console.log(`  Output:        ${uiOutAmount} USDC`);
  console.log(`  Router Type:   ${quote.routerType}`);
  console.log(`  Price Impact:  ${quote.priceImpactPct ?? "N/A"}%`);
  console.log(`  Pool(s):       ${quote.poolAddresses.join(", ") || "N/A"}`);
  console.log(`  Has Tx:        ${!!quote.transaction}`);
}

main();
