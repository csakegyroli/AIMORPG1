import { IsInt, IsObject, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateSaveDto {
  @IsString() @MaxLength(70) label!: string;
  @IsInt() @Min(1) @Max(100) schemaVersion!: number;
  @IsObject() payload!: Record<string, unknown>;
}
