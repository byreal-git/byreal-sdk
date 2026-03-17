import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { getAmountBFromAmountA, getAmountAFromAmountB } from "@byreal-io/byreal-clmm-sdk";
import type { ByrealContext } from "../types/config.js";
import type { Result, SignerCallback, PreparedTransaction } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type {
  PositionListResult,
  PositionListParams,
  OpenPositionParams,
  OpenPositionResult,
  ClosePositionParams,
  ClosePositionResult,
  ClaimFeesParams,
  ClaimFeesResult,
} from "../types/position.js";
import * as positionsApi from "../api/positions.js";
import * as poolsApi from "../api/pools.js";
import * as incentiveApi from "../api/incentive.js";
import {
  calculateTickAlignedPriceRange,
  calculateTokenAmountsFromUsd,
} from "../utils/calculate.js";
import { uiToRaw } from "../utils/amounts.js";
import {
  deserializeTransaction,
  sendAndConfirmTx,
  refreshBlockhash,
} from "../utils/transaction.js";
import {
  validationError,
  priceUnavailableError,
  positionNotFoundError,
  sdkError,
} from "../errors/errors.js";
import { ok, err } from "../types/common.js";

export class PositionService {
  constructor(private ctx: ByrealContext) {}

  // ============================================
  // Read operations (API only)
  // ============================================

  async list(params: PositionListParams): Promise<Result<PositionListResult, ByrealError>> {
    return positionsApi.listPositions(this.ctx.apiClient, params);
  }

  async getDetail(positionAddress: string): Promise<Result<Record<string, unknown>, ByrealError>> {
    return positionsApi.getPositionDetail(this.ctx.apiClient, positionAddress);
  }

  async getUnclaimed(userAddress: string): Promise<Result<Record<string, unknown>, ByrealError>> {
    return positionsApi.getUnclaimedData(this.ctx.apiClient, userAddress);
  }

  async getOverview(userAddress: string): Promise<Result<Record<string, unknown>, ByrealError>> {
    return positionsApi.getPositionOverview(this.ctx.apiClient, userAddress);
  }

  // ============================================
  // Open Position
  // ============================================

  async prepareOpenPosition(
    params: OpenPositionParams,
  ): Promise<Result<PreparedTransaction, ByrealError>> {
    const computed = await this.computeOpenPositionArgs(params);
    if (!computed.ok) return computed;

    const { tickLower, tickUpper, base, baseAmount, otherAmountMax, poolInfo } = computed.value;

    const result = await this.ctx.clmmChain.createPositionInstructions({
      userAddress: new PublicKey(params.userAddress),
      poolInfo,
      tickLower,
      tickUpper,
      base,
      baseAmount,
      otherAmountMax,
      refererPosition: params.refererPosition,
    });

    return ok({
      transaction: result.transaction,
      metadata: {
        nftAddress: result.nftAddress,
        tickLower,
        tickUpper,
        base,
      },
    });
  }

  async openPosition(
    params: OpenPositionParams & { signerCallback: SignerCallback },
  ): Promise<Result<OpenPositionResult, ByrealError>> {
    const prepareResult = await this.prepareOpenPosition(params);
    if (!prepareResult.ok) return prepareResult;

    const signedTx = await params.signerCallback(prepareResult.value.transaction);

    const sendResult = await sendAndConfirmTx(this.ctx.connection, signedTx);
    if (!sendResult.ok) return sendResult;

    return ok({
      signature: sendResult.value.signature,
      confirmed: sendResult.value.confirmed,
      nftAddress: prepareResult.value.metadata.nftAddress as string | undefined,
    });
  }

  // ============================================
  // Close Position
  // ============================================

  async prepareClosePosition(
    params: ClosePositionParams,
  ): Promise<Result<PreparedTransaction, ByrealError>> {
    const nftMint = new PublicKey(params.nftMint);
    const slippage = (params.slippageBps ?? this.ctx.config.defaultSlippageBps) / 10000;

    const result = await this.ctx.clmmChain.decreaseFullLiquidityInstructions({
      userAddress: new PublicKey(params.userAddress),
      nftMint,
      closePosition: true,
      slippage,
    });

    return ok({
      transaction: result.transaction,
      metadata: { nftMint: params.nftMint },
    });
  }

  async closePosition(
    params: ClosePositionParams & { signerCallback: SignerCallback },
  ): Promise<Result<ClosePositionResult, ByrealError>> {
    const prepareResult = await this.prepareClosePosition(params);
    if (!prepareResult.ok) return prepareResult;

    const signedTx = await params.signerCallback(prepareResult.value.transaction);

    const sendResult = await sendAndConfirmTx(this.ctx.connection, signedTx);
    if (!sendResult.ok) return sendResult;

    return ok({
      signature: sendResult.value.signature,
      confirmed: sendResult.value.confirmed,
    });
  }

  // ============================================
  // Claim Fees
  // ============================================

  async prepareClaimFees(
    params: ClaimFeesParams,
  ): Promise<Result<PreparedTransaction[], ByrealError>> {
    // Resolve NFT mints → position addresses
    const listResult = await positionsApi.listPositions(this.ctx.apiClient, {
      userAddress: params.userAddress,
      page: 1,
      pageSize: 100,
    });

    if (!listResult.ok) return listResult;

    const nftToPosition = new Map<string, string>();
    for (const pos of listResult.value.positions) {
      nftToPosition.set(pos.nftMintAddress, pos.positionAddress);
    }

    const positionAddresses: string[] = [];
    const notFound: string[] = [];
    for (const nft of params.nftMints) {
      const posAddr = nftToPosition.get(nft);
      if (posAddr) {
        positionAddresses.push(posAddr);
      } else {
        notFound.push(nft);
      }
    }

    if (notFound.length > 0) {
      return err(positionNotFoundError(notFound.join(", ")));
    }

    // Encode fee claim transactions
    const encodeResult = await incentiveApi.encodeFee(this.ctx.apiClient, {
      walletAddress: params.userAddress,
      positionAddresses,
    });

    if (!encodeResult.ok) return encodeResult;

    const preparedTxs: PreparedTransaction[] = [];
    for (const entry of encodeResult.value) {
      const txResult = deserializeTransaction(entry.txPayload);
      if (!txResult.ok) return txResult;
      preparedTxs.push({
        transaction: txResult.value,
        metadata: {
          positionAddress: entry.positionAddress,
          tokens: entry.tokens,
        },
      });
    }

    return ok(preparedTxs);
  }

  async claimFees(
    params: ClaimFeesParams & { signerCallback: SignerCallback },
  ): Promise<Result<ClaimFeesResult, ByrealError>> {
    const prepareResult = await this.prepareClaimFees(params);
    if (!prepareResult.ok) return prepareResult;

    const signatures: string[] = [];
    for (const prepared of prepareResult.value) {
      // Refresh blockhash — the API-returned tx may contain an expired one
      await refreshBlockhash(this.ctx.connection, prepared.transaction);

      const signedTx = await params.signerCallback(prepared.transaction);

      const sendResult = await sendAndConfirmTx(this.ctx.connection, signedTx);
      if (!sendResult.ok) return sendResult;

      signatures.push(sendResult.value.signature);
    }

    return ok({ signatures, confirmed: true });
  }

  // ============================================
  // Internal: compute open position arguments
  // ============================================

  private async computeOpenPositionArgs(params: OpenPositionParams) {
    const useAmountUsd = params.amountUsd != null;
    const useTokenAmount = params.amount != null;

    if (useAmountUsd && useTokenAmount) {
      return err(validationError("amount and amountUsd are mutually exclusive"));
    }
    if (!useAmountUsd && !useTokenAmount) {
      return err(validationError("Either amount (with base) or amountUsd is required"));
    }
    if (useTokenAmount && !params.base) {
      return err(validationError("base is required when using amount"));
    }

    const chain = this.ctx.clmmChain;
    const poolInfo = await chain.getRawPoolInfoByPoolId(new PublicKey(params.poolAddress));

    // Align prices to ticks
    const { priceInTickLower, priceInTickUpper } = calculateTickAlignedPriceRange({
      tickSpacing: poolInfo.tickSpacing,
      mintDecimalsA: poolInfo.mintDecimalsA,
      mintDecimalsB: poolInfo.mintDecimalsB,
      startPrice: params.priceLower,
      endPrice: params.priceUpper,
    });

    const tickLower = priceInTickLower.tick;
    const tickUpper = priceInTickUpper.tick;

    // Get pool API info for symbols and prices
    let tokenAPriceUsd = 0;
    let tokenBPriceUsd = 0;
    const poolApiResult = await poolsApi.getPoolDetail(this.ctx.apiClient, params.poolAddress);
    if (poolApiResult.ok) {
      tokenAPriceUsd = poolApiResult.value.token_a.price_usd ?? 0;
      tokenBPriceUsd = poolApiResult.value.token_b.price_usd ?? 0;
    }

    let base: "MintA" | "MintB";
    let baseAmount: BN;
    let otherAmount: BN;

    if (useAmountUsd) {
      if (tokenAPriceUsd <= 0 || tokenBPriceUsd <= 0) {
        return err(
          priceUnavailableError(
            poolApiResult.ok ? poolApiResult.value.token_a.symbol : "MintA",
            poolApiResult.ok ? poolApiResult.value.token_b.symbol : "MintB",
          ),
        );
      }

      const amounts = calculateTokenAmountsFromUsd({
        capitalUsd: params.amountUsd!,
        tokenAPriceUsd,
        tokenBPriceUsd,
        priceLower: priceInTickLower.price,
        priceUpper: priceInTickUpper.price,
        poolInfo,
      });

      base = "MintA";
      baseAmount = amounts.amountA;
      otherAmount = amounts.amountB;
    } else {
      base = params.base!;
      const baseDecimals = base === "MintA" ? poolInfo.mintDecimalsA : poolInfo.mintDecimalsB;
      baseAmount = new BN(uiToRaw(params.amount!, baseDecimals));

      if (base === "MintA") {
        otherAmount = getAmountBFromAmountA({
          priceLower: priceInTickLower.price,
          priceUpper: priceInTickUpper.price,
          amountA: baseAmount,
          poolInfo,
        });
      } else {
        otherAmount = getAmountAFromAmountB({
          priceLower: priceInTickLower.price,
          priceUpper: priceInTickUpper.price,
          amountB: baseAmount,
          poolInfo,
        });
      }
    }

    // Apply slippage
    const slippageBps = params.slippageBps ?? this.ctx.config.defaultSlippageBps;
    const slippageMultiplier = 10000 + slippageBps;
    const otherAmountMax = otherAmount.mul(new BN(slippageMultiplier)).div(new BN(10000));

    return ok({
      tickLower,
      tickUpper,
      base,
      baseAmount,
      otherAmountMax,
      poolInfo,
    });
  }
}
