import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PartnerAccessKey } from "../entities/partner-access-key.entity";
import { IPartnerAccessKeyRepository } from "./partner.repository.interface";

@Injectable()
export class PartnerAccessKeyRepository implements IPartnerAccessKeyRepository {
  constructor(
    @InjectRepository(PartnerAccessKey)
    private readonly repo: Repository<PartnerAccessKey>,
  ) {}

  async findAll(): Promise<PartnerAccessKey[]> {
    return this.repo.find();
  }

  async findOneBy(where: Partial<PartnerAccessKey>): Promise<PartnerAccessKey | undefined> {
    return this.repo.findOne({ where });
  }

  async findByEntityId(entityId: string): Promise<PartnerAccessKey[] | undefined> {
    return this.repo.findBy({ entity_id: entityId });
  }

  async findByEntityIdActive(entityId: string): Promise<PartnerAccessKey[] | undefined> {
    return this.repo.findBy({ entity_id: entityId, is_active: true });
  }

  async create(partnerData: Partial<PartnerAccessKey>): Promise<PartnerAccessKey> {
    const partner = this.repo.create(partnerData);
    return this.repo.save(partner);
  }

  async update(partnerAccessKeyId: string, partnerData: Partial<PartnerAccessKey>): Promise<void> {
    await this.repo.update(partnerAccessKeyId, partnerData);
  }

  async save(partner: PartnerAccessKey): Promise<PartnerAccessKey> {
    return this.repo.save(partner);
  }

  async findByPartnerAccessKeyId(partnerAccessKeyId: string): Promise<PartnerAccessKey | undefined> {
    return this.repo.findOneBy({ key_id: partnerAccessKeyId });
  }

  async findByPartnerAccessKeyIdActive(partnerAccessKeyId: string): Promise<PartnerAccessKey | undefined> {
    return this.repo.findOneBy({ key_id: partnerAccessKeyId, is_active: true });
  }
}
