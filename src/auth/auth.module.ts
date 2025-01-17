import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CommonModule } from "../common/common.module";
import { PassportModule } from "@nestjs/passport";
import { PartnerModule } from "../partner/partner.module";
import { ApiKeyMagnifiStrategy } from "./strategies/api-key-magnifi.strategy";
import { AccessKeyPartnerStrategy } from "./strategies/access-key-partner.strategy";

@Module({
  imports: [CommonModule, PartnerModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, ApiKeyMagnifiStrategy, AccessKeyPartnerStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
