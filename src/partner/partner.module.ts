import { Module } from "@nestjs/common";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { PartnerAccessKeyRepository } from "./repositories/partner.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PartnerAccessKey } from "./entities/partner-access-key.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([PartnerAccessKey])],
  controllers: [PartnerController],
  providers: [PartnerAccessKeyRepository, PartnerService],
  exports: [PartnerAccessKeyRepository, PartnerService],
})
export class PartnerModule {}
