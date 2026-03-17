import type { ByrealContext } from "../types/config.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import * as configApi from "../api/config-api.js";

export class FeeService {
  constructor(private ctx: ByrealContext) {}

  async getAutoFee(): Promise<
    Result<{ high: number; medium: number; extreme: number }, ByrealError>
  > {
    return configApi.getAutoFee(this.ctx.apiClient);
  }

  async getJitoTip(): Promise<Result<Record<string, unknown>, ByrealError>> {
    return configApi.getJitoTip(this.ctx.apiClient);
  }
}
