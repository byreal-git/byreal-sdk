/**
 * Execute a token swap (requires SOL_SECRET_KEY)
 *
 * Usage:
 *   SOL_SECRET_KEY=<base58-key> npx tsx examples/06_swap_execute.ts
 */

import { sdk, requireUserAddress, signerCallback, TokenAddress } from "./config.js";
import { uiToRaw, rawToUi } from "../src/index.js";

async function main(): Promise<void> {
  const userPubkey = requireUserAddress();
  const inputMint = TokenAddress.SOL.toBase58();
  const outputMint = TokenAddress.USDC.toBase58();
  const uiAmount = "0.01"; // 0.01 SOL
  const rawAmount = uiToRaw(uiAmount, 9);

  console.log(`Executing swap: ${uiAmount} SOL → USDC`);
  console.log(`User: ${userPubkey.toBase58()}\n`);

  const result = await sdk.swap.executeSwap({
    inputMint,
    outputMint,
    amount: rawAmount,
    swapMode: "in",
    slippageBps: 200,
    userPublicKey: userPubkey.toBase58(),
    signerCallback,
  });

  if (!result.ok) {
    console.error("Error:", result.error.message);
    return;
  }

  const swap = result.value;
  const uiOut = rawToUi(swap.outAmount, 6); // USDC decimals

  console.log("Swap Result:");
  console.log(`  Signatures:  ${swap.signatures.join(", ")}`);
  console.log(`  Confirmed:   ${swap.confirmed}`);
  console.log(`  Router Type: ${swap.routerType}`);
  console.log(`  Output:      ${uiOut} USDC`);
}

main();
