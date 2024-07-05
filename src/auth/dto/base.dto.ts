import { IsString, IsNotEmpty } from "class-validator";

export class BaseDto {
  @IsString()
  @IsNotEmpty()
  partnerAccessKey: string;

  @IsString()
  @IsNotEmpty()
  entityId: string;
}
