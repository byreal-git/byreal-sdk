# Byreal SDK

Full-featured Byreal DEX SDK for Solana — API client, CLMM position management, swap, and more.

## Installation

```bash
npm install @byreal-io/byreal-sdk
```

## Quick Start

### Initialize SDK

```typescript
import { Connection } from "@solana/web3.js";
import { ByrealSDK } from "@byreal-io/byreal-sdk";

const connection = new Connection("https://api.mainnet-beta.solana.com");

const sdk = new ByrealSDK({ connection });
```

## Core Features

### 1. Query Pools

List, search, and get pool details.

```typescript
// List pools sorted by TVL
const poolsResult = await sdk.pools.list({
  pageSize: 10,
  sortField: "tvl",
  sortType: "desc",
});

if (poolsResult.ok) {
  for (const pool of poolsResult.value.items) {
    console.log(`${pool.pair} | TVL: $${pool.tvl_usd} | APR: ${pool.apr}%`);
  }
}

// Get pool details
const detailResult = await sdk.pools.getDetail("pool-address");

// Get K-line data
const klines = await sdk.pools.getKlines({
  poolAddress: "pool-address",
  tokenAddress: "token-mint",
  klineType: "1h",
});
```

### 2. Query Tokens

```typescript
// List tokens
const tokensResult = await sdk.tokens.list({
  searchKey: "SOL",
  pageSize: 10,
});

// Batch fetch prices
const prices = await sdk.tokens.getPrices([
  "So11111111111111111111111111111111111111112",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
]);
```

### 3. Global Overview

```typescript
const overview = await sdk.overview.getGlobal();

if (overview.ok) {
  console.log(`TVL: $${overview.value.tvl}`);
  console.log(`24h Volume: $${overview.value.volume_24h_usd}`);
  console.log(`24h Fees: $${overview.value.fee_24h_usd}`);
  console.log(`Pools: ${overview.value.pools_count}`);
}
```

### 4. Swap Tokens

Get quotes and execute swaps through the Byreal router (AMM + RFQ auto-routing).

```typescript
// Preview swap (quote only)
const quote = await sdk.swap.getQuote({
  inputMint: "So11111111111111111111111111111111111111112",
  outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  amount: "1000000000", // 1 SOL in lamports
  swapMode: "in",
  slippageBps: 200,
  userPublicKey: wallet.publicKey.toBase58(),
});

// Execute swap with signing
const swapResult = await sdk.swap.executeSwap({
  inputMint: "So11111111111111111111111111111111111111112",
  outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  amount: "1000000000",
  swapMode: "in",
  userPublicKey: wallet.publicKey.toBase58(),
  signerCallback: async (tx) => {
    tx.sign([wallet]);
    return tx;
  },
});

if (swapResult.ok) {
  console.log("Swap signatures:", swapResult.value.signatures);
  console.log("Confirmed:", swapResult.value.confirmed);
}
```

### 5. Manage Positions

Open, close, and claim fees for CLMM liquidity positions.

#### Open Position

```typescript
// Open position with USD amount (auto token split)
const openResult = await sdk.positions.openPosition({
  poolAddress: "pool-address",
  priceLower: "0.998",
  priceUpper: "1.002",
  amountUsd: 1000, // $1000 investment
  userAddress: wallet.publicKey.toBase58(),
  signerCallback: async (tx) => {
    tx.sign([wallet]);
    return tx;
  },
});

// Or with explicit token amount
const openResult2 = await sdk.positions.openPosition({
  poolAddress: "pool-address",
  priceLower: "0.998",
  priceUpper: "1.002",
  base: "MintA",
  amount: "100", // 100 TokenA (UI amount)
  userAddress: wallet.publicKey.toBase58(),
  signerCallback: async (tx) => {
    tx.sign([wallet]);
    return tx;
  },
});
```

#### Close Position

```typescript
const closeResult = await sdk.positions.closePosition({
  nftMint: "position-nft-mint-address",
  userAddress: wallet.publicKey.toBase58(),
  signerCallback: async (tx) => {
    tx.sign([wallet]);
    return tx;
  },
});
```

#### Claim Fees

```typescript
const claimResult = await sdk.positions.claimFees({
  nftMints: ["nft-mint-1", "nft-mint-2"],
  userAddress: wallet.publicKey.toBase58(),
  signerCallback: async (tx) => {
    tx.sign([wallet]);
    return tx;
  },
});
```

#### List & Query Positions

```typescript
// List positions
const positions = await sdk.positions.list({
  userAddress: wallet.publicKey.toBase58(),
  status: 0, // 0 = active
});

// Get unclaimed fees
const unclaimed = await sdk.positions.getUnclaimed(wallet.publicKey.toBase58());
```

### 6. Copy Farming

Discover top-performing positions and copy their strategies.

```typescript
// Get top positions for a pool
const topPositions = await sdk.copyFarmer.getTopPositions({
  poolAddress: "pool-address",
  sortField: "liquidity",
  sortType: "desc",
  pageSize: 10,
});

// Copy a position
const copyResult = await sdk.copyFarmer.copyPosition({
  sourcePositionAddress: "position-address",
  amountUsd: 500,
  userAddress: wallet.publicKey.toBase58(),
  signerCallback: async (tx) => {
    tx.sign([wallet]);
    return tx;
  },
});
```

### 7. Priority Fees

```typescript
const feeResult = await sdk.fees.getAutoFee();
if (feeResult.ok) {
  console.log("High:", feeResult.value.high);
  console.log("Medium:", feeResult.value.medium);
  console.log("Extreme:", feeResult.value.extreme);
}
```

## Low-level API Access

For advanced use cases, you can access the API client directly:

```typescript
import { ApiClient, API_ENDPOINTS } from "@byreal-io/byreal-sdk/api";

const client = new ApiClient({ baseUrl: "https://api2.byreal.io" });

// Call any endpoint directly
const result = await client.get(API_ENDPOINTS.POOLS_LIST, {
  page: 1,
  pageSize: 10,
  sortField: "tvl",
});
```

## Utility Functions

```typescript
import {
  uiToRaw,
  rawToUi,
  calculateTickAlignedPriceRange,
  calculateTokenAmountsFromUsd,
} from "@byreal-io/byreal-sdk";

// Amount conversion
uiToRaw("1.5", 9); // '1500000000'
rawToUi("1500000000", 9); // '1.5'

// Tick-aligned price range
const { priceInTickLower, priceInTickUpper } = calculateTickAlignedPriceRange({
  tickSpacing: 1,
  mintDecimalsA: 9,
  mintDecimalsB: 6,
  startPrice: "0.998",
  endPrice: "1.002",
});
```

## Examples

More examples are available in the [examples](./examples) directory:

- Query: `01_list_pools.ts`, `02_get_pool_detail.ts`, `03_list_tokens.ts`, `04_global_overview.ts`
- Swap: `05_swap_quote.ts`, `06_swap_execute.ts`
- Positions: `07_list_positions.ts`, `08_open_position.ts`, `09_close_position.ts`, `10_claim_fees.ts`
- Copy Farming: `11_top_positions.ts`, `12_copy_position.ts`
- Utility: `13_priority_fees.ts`, `14_tick_aligned_price.ts`, `15_token_prices.ts`, `16_kline_data.ts`

## License

MIT
