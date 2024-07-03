import { IsString, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class RemoveDto {
  @IsString()
  @IsNotEmpty()
  partnerAccessKeyId: string;

  @IsString()
  @IsNotEmpty()
  entityId: string;
}
