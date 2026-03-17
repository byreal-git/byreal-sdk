/**
 * Shared configuration for all examples.
 *
 * Set environment variables before running:
 *   SOL_ENDPOINT  — Solana RPC endpoint (default: mainnet-beta)
 *   SOL_SECRET_KEY — Base58-encoded wallet secret key (required for write operations)
 */

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { ByrealSDK } from "../src/index.js";
import type { SignerCallback } from "../src/index.js";

// ============================================
// Connection
// ============================================

const DEFAULT_RPC_URL = "https://jenelle-p85r4h-fast-mainnet.helius-rpc.com";
const endpoint = process.env.SOL_ENDPOINT || DEFAULT_RPC_URL;
export const connection = new Connection(endpoint);

// ============================================
// SDK Instance
// ============================================

export const sdk = new ByrealSDK({
  connection,
  config: {
    debug: !!process.env.DEBUG,
  },
});

// ============================================
// Wallet (optional — only needed for write operations)
// ============================================

function loadKeypair(): Keypair | undefined {
  const secretKey = process.env.SOL_SECRET_KEY;
  if (!secretKey) return undefined;
  return Keypair.fromSecretKey(bs58.decode(secretKey));
}

const _keypair = loadKeypair();

export const userKeypair = _keypair;
export const userAddress = _keypair?.publicKey;

export function requireKeypair(): Keypair {
  if (!_keypair) {
    throw new Error("SOL_SECRET_KEY environment variable is required for this example");
  }
  return _keypair;
}

export function requireUserAddress(): PublicKey {
  const kp = requireKeypair();
  return kp.publicKey;
}

export const signerCallback: SignerCallback = async (tx) => {
  const kp = requireKeypair();
  tx.sign([kp]);
  return tx;
};

// ============================================
// Well-known Addresses
// ============================================

export const TokenAddress = {
  SOL: new PublicKey("So11111111111111111111111111111111111111112"),
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  USDT: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  BBSOL: new PublicKey("Bybit2vBJGhPF52GBdNaQfUJ6ZpThSgHBobjWZpLPb4B"),
};

export const PoolAddress = {
  SOL_BBSOL: new PublicKey("87pbGHxigtjdMovzkAAFEe8XFVTETjDomoEFfpSFd2yD"),
  USDC_USDT: new PublicKey("23XoPQqGw9WMsLoqTu8HMzJLD6RnXsufbKyWPLJywsCT"),
  SOL_USDC: new PublicKey("9GTj99g9tbz9U6UYDsX6YeRTgUnkYG6GTnHv3qLa5aXq"),
  XAUT0_USDT: new PublicKey("EUAa7W7omZMN6mzLFidmULMYwJBFxfUzE3kD8ywX9Qq9"),
};
