import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { LoggerService } from "../common/logger.service";
import { EnvService } from "../common/env.service";

import { PartnerService } from "../partner/partner.service";
import { plainToInstance } from "class-transformer";
import { ListResponseDto } from "./dto/list.dto";
import { GenerateResponseDto } from "./dto/generate.dto";
import { validateSync } from "class-validator";
import { RemoveDto } from "./dto/remove.dto";
import { PartnerAccessKey } from "../partner/entities/partner-access-key.entity";

const ACCESS_SECRET_LENGTH = 64;
const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private partnerService: PartnerService,
    private readonly logger: LoggerService,
    private readonly envService: EnvService,
  ) {}

  private async generateAccessCredentials(): Promise<{
    accessKey: string;
    accessSecret: string;
    hashedSecret: string;
  }> {
    const accessKey: string = `pak_${uuidv4()}`;
    const accessSecret: string = randomBytes(ACCESS_SECRET_LENGTH).toString("hex");

    const hashedSecret: string = await bcrypt.hash(accessSecret, SALT_ROUNDS);

    return { accessKey, accessSecret, hashedSecret };
  }

  async generate(partnerDetails: Record<string, any>, _log_ctx: Record<string, any>): Promise<GenerateResponseDto> {
    const { accessKey, accessSecret, hashedSecret } = await this.generateAccessCredentials();

    const partnerAccessKeyObj = this.partnerService.generatePartnerAccessKeyObj(
      partnerDetails,
      accessKey,
      hashedSecret,
    );
    const partnerAccessKey = await this.partnerService.createPartnerAccessKey(partnerAccessKeyObj);
    if (!partnerAccessKey || !partnerAccessKey.key_secret_hash) {
      this.logger.error("invalid partner access key generated", { ..._log_ctx });
      throw new Error("failed to generate partner access key");
    }

    const transformedInstance = plainToInstance(
      GenerateResponseDto,
      { accessSecret, accessKey: partnerAccessKey.key_id, entity_id: partnerAccessKey.entity_id },
      {
        excludeExtraneousValues: true,
      },
    );

    const errors = validateSync(transformedInstance);
    if (errors.length > 0) {
      throw new Error(`validation failed: ${errors.toString()}`);
    }

    return transformedInstance;
  }

  async list(entityId: string, showAll: boolean): Promise<ListResponseDto[]> {
    const partnerAccessKeys = await this.partnerService.listPartnerAccessKeys(entityId, showAll);

    const transformedInstance = plainToInstance(ListResponseDto, partnerAccessKeys, {
      excludeExtraneousValues: true,
    });

    const errors = validateSync(transformedInstance);
    if (errors.length > 0) {
      throw new Error(`validation failed: ${errors.toString()}`);
    }

    return transformedInstance;
  }

  async remove(removeDto: RemoveDto, _log_ctx: Record<string, any>) {
    await this.partnerService.removeByPartnerAccessKey(removeDto, _log_ctx);
    return;
  }
}
