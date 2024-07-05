import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { LoggerService } from "../common/logger.service";
import { PartnerAccessKey } from "./entities/partner-access-key.entity";
import { PartnerAccessKeyRepository } from "./repositories/partner.repository";
import { RemoveDto } from "../auth/dto/remove.dto";
import { RenameDto } from "../auth/dto/rename.dto";

@Injectable()
export class PartnerService {
  constructor(
    private readonly partnerAccessKeyRepository: PartnerAccessKeyRepository,
    private readonly logger: LoggerService,
  ) {}

  generatePartnerAccessKeyObj(
    partnerDetails: Record<string, any>,
    accessKey: string,
    hashedSecret: string,
  ): PartnerAccessKey {
    const partnerAccessKeyObj = new PartnerAccessKey();
    partnerAccessKeyObj.entity_id = partnerDetails.entityId;
    partnerAccessKeyObj.key_id = accessKey;
    partnerAccessKeyObj.user_id = partnerDetails.userId;
    partnerAccessKeyObj.organization_member_id = partnerDetails.organizationMemberId;
    partnerAccessKeyObj.key_secret_hash = hashedSecret;
    partnerAccessKeyObj.name = partnerDetails.name;
    partnerAccessKeyObj.is_active = true;
    return partnerAccessKeyObj;
  }

  async createPartnerAccessKey(partnerAccessKeyObj: PartnerAccessKey): Promise<PartnerAccessKey> {
    return this.partnerAccessKeyRepository.create(partnerAccessKeyObj);
  }

  async listPartnerAccessKeys(entityId: string, showAll = false): Promise<Partial<PartnerAccessKey>[]> {
    if (showAll) {
      return this.partnerAccessKeyRepository.findByEntityId(entityId);
    }
    return this.partnerAccessKeyRepository.findByEntityIdActive(entityId);
  }

  async removeByPartnerAccessKey(removeDto: RemoveDto, _log_ctx: Record<string, any>) {
    const partnerAccessKey = await this.partnerAccessKeyRepository.findOneBy({
      key_id: removeDto.partnerAccessKey,
    });

    if (!partnerAccessKey) {
      this.logger.warn("Partner access key not found, continuing..", { ..._log_ctx });
      return;
    }

    partnerAccessKey.is_active = false;
    await this.partnerAccessKeyRepository.save(partnerAccessKey);

    this.logger.log("Partner access key found, updated successfully", { ..._log_ctx });
    return;
  }

  async renamePartnerAccessKey(renameDto: RenameDto, _log_ctx: Record<string, any>): Promise<PartnerAccessKey | null> {
    const partnerAccessKey = await this.partnerAccessKeyRepository.findOneBy({
      key_id: renameDto.partnerAccessKey,
    });

    if (!partnerAccessKey) {
      this.logger.warn("Partner access key not found, continuing..", { ..._log_ctx });
      return null;
    }

    partnerAccessKey.name = renameDto.name;
    await this.partnerAccessKeyRepository.save(partnerAccessKey);

    this.logger.log("Partner access key found, updated successfully", { ..._log_ctx });
    return partnerAccessKey;
  }

  async checkIfValidAccessKeyAndSecret(accessKey: string, accessSecret: string, requestId: string): Promise<boolean> {
    const partnerAccessKey = await this.partnerAccessKeyRepository.findByPartnerAccessKeyIdActive(accessKey);

    if (!partnerAccessKey) {
      this.logger.warn("Partner Access Key not found", { requestId });
      return false;
    }

    const isValid = await bcrypt.compare(accessSecret, partnerAccessKey.key_secret_hash);
    if (!isValid) {
      this.logger.warn("Invalid Partner Access Key", { requestId });
      return false;
    }
    return true;
  }
}
