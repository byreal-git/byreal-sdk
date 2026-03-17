import type { ByrealContext } from "../types/config.js";
import type { Result, SignerCallback } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type {
  TopPositionsParams,
  TopPositionsResult,
  TopFarmersParams,
  CopyFarmerOverview,
  CopyPositionParams,
} from "../types/copyfarmer.js";
import type { OpenPositionResult } from "../types/position.js";
import { PublicKey } from "@solana/web3.js";
import { SqrtPriceMath } from "@byreal-io/byreal-clmm-sdk";
import { positionNotFoundError } from "../errors/errors.js";
import * as copyfarmerApi from "../api/copyfarmer.js";
import { PositionService } from "./position.service.js";

export class CopyFarmerService {
  private positionService: PositionService;

  constructor(private ctx: ByrealContext) {
    this.positionService = new PositionService(ctx);
  }

  async getTopPositions(
    params: TopPositionsParams,
  ): Promise<Result<TopPositionsResult, ByrealError>> {
    return copyfarmerApi.getTopPositions(this.ctx.apiClient, params);
  }

  async getOverview(): Promise<Result<CopyFarmerOverview, ByrealError>> {
    return copyfarmerApi.getCopyFarmerOverview(this.ctx.apiClient);
  }

  async getTopFarmers(
    params?: TopFarmersParams,
  ): Promise<Result<Record<string, unknown>, ByrealError>> {
    return copyfarmerApi.getTopFarmers(this.ctx.apiClient, params);
  }

  async getProviderOverview(
    providerAddress: string,
  ): Promise<Result<Record<string, unknown>, ByrealError>> {
    return copyfarmerApi.getProviderOverview(this.ctx.apiClient, providerAddress);
  }

  /**
   * Copy a top position: reads the source position's range then opens a matching position
   */
  async copyPosition(
    params: CopyPositionParams & { signerCallback: SignerCallback },
  ): Promise<Result<OpenPositionResult, ByrealError>> {
    // Get the source position's detail to extract tick range and pool
    const detailResult = await this.ctx.apiClient.get<any>("/byreal/api/dex/v2/position/detail", {
      address: params.sourcePositionAddress,
    });

    if (!detailResult.ok) return detailResult;

    const posData = detailResult.value?.result?.data;
    if (!posData) {
      return { ok: false, error: positionNotFoundError(params.sourcePositionAddress) };
    }

    // Get pool info to compute tick-aligned prices
    // API returns pool info nested under posData.pool
    const poolAddress: string = posData.pool?.poolAddress ?? posData.poolAddress;
    if (!poolAddress) {
      return { ok: false, error: positionNotFoundError(params.sourcePositionAddress) };
    }
    const poolInfo = await this.ctx.clmmChain.getRawPoolInfoByPoolId(new PublicKey(poolAddress));

    const lowerSqrt = SqrtPriceMath.getSqrtPriceX64FromTick(posData.lowerTick);
    const upperSqrt = SqrtPriceMath.getSqrtPriceX64FromTick(posData.upperTick);
    const priceLower = SqrtPriceMath.sqrtPriceX64ToPrice(
      lowerSqrt,
      poolInfo.mintDecimalsA,
      poolInfo.mintDecimalsB,
    );
    const priceUpper = SqrtPriceMath.sqrtPriceX64ToPrice(
      upperSqrt,
      poolInfo.mintDecimalsA,
      poolInfo.mintDecimalsB,
    );

    return this.positionService.openPosition({
      poolAddress,
      priceLower: priceLower.toString(),
      priceUpper: priceUpper.toString(),
      amountUsd: params.amountUsd,
      userAddress: params.userAddress,
      slippageBps: params.slippageBps,
      refererPosition: params.sourcePositionAddress,
      signerCallback: params.signerCallback,
    });
  }
}
