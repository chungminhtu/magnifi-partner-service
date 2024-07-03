import { Expose } from "class-transformer";
import { IsString, IsBoolean, IsNotEmpty, IsDate } from "class-validator";

export class ListResponseDto {
  @Expose({ name: "key_id" })
  @IsString()
  partnerAccessKeyId: string;

  @Expose({ name: "entity_id" })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @Expose({ name: "user_id" })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Expose({ name: "organization_member_id" })
  @IsString()
  @IsNotEmpty()
  organizationMemberId: string;

  @Expose({ name: "is_active" })
  @IsBoolean()
  isActive: boolean;

  @Expose({ name: "created_at" })
  @IsDate()
  createdAt: Date;
}
