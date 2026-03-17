import type { ByrealContext } from "../types/config.js";
import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import type { GlobalOverview } from "../types/overview.js";
import * as overviewApi from "../api/overview.js";

export class OverviewService {
  constructor(private ctx: ByrealContext) {}

  async getGlobal(): Promise<Result<GlobalOverview, ByrealError>> {
    return overviewApi.getGlobalOverview(this.ctx.apiClient);
  }
}
