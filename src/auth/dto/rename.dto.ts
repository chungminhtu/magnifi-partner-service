import { IsString, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";
import { BaseDto } from "./base.dto";

export class RenameDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
