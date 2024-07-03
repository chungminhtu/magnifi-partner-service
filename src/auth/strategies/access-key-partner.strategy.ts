import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { PartnerService } from "../../partner/partner.service";
import { LoggerService } from "../../common/logger.service";

@Injectable()
export class AccessKeyPartnerStrategy extends PassportStrategy(Strategy, "access-key-partner") {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnerService: PartnerService,
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const accessKey = req.headers["x-access-key"];
    const accessSecret = req.headers["x-access-secret"];
    const requestId = req.headers["x-request-id"];

    if (!accessKey || !accessSecret) {
      this.logger.warn("access key and access secret are missing", { requestId });
      throw new UnauthorizedException("access key and access secret are required");
    }

    const allowAccess = await this.partnerService.checkIfValidAccessKeyAndSecret(accessKey, accessSecret, requestId);

    if (!allowAccess) {
      throw new UnauthorizedException("Invalid access key or access secret");
    }

    return allowAccess;
  }
}
