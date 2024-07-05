import { IsNotEmpty, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class GenerateDto {
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  organizationMemberId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GenerateResponseDto {
  @Expose({ name: "accessSecret" })
  @IsString()
  @IsNotEmpty()
  partnerAccessKeySecret: string;

  @Expose({ name: "accessKey" })
  @IsString()
  @IsNotEmpty()
  partnerAccessKey: string;

  @Expose({ name: "entity_id" })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @Expose({ name: "name" })
  @IsString()
  name: string;
}
