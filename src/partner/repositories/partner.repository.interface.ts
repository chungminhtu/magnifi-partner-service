import { PartnerAccessKey } from "../entities/partner-access-key.entity";

export interface IPartnerAccessKeyRepository {
  findAll(): Promise<PartnerAccessKey[]>;

  findOneBy(where: Partial<PartnerAccessKey>): Promise<PartnerAccessKey | undefined>;

  findByEntityId(entityId: string): Promise<PartnerAccessKey[] | undefined>;

  findByEntityIdActive(entityId: string): Promise<PartnerAccessKey[] | undefined>;

  create(partnerData: Partial<PartnerAccessKey>): Promise<PartnerAccessKey>;

  update(partnerAccessKeyId: string, partnerData: Partial<PartnerAccessKey>): Promise<void>;

  save(partner: PartnerAccessKey): Promise<PartnerAccessKey>;

  findByPartnerAccessKeyId(partnerAccessKeyId: string): Promise<PartnerAccessKey | undefined>;

  findByPartnerAccessKeyIdActive(partnerAccessKeyId: string): Promise<PartnerAccessKey | undefined>;
}
