import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min, ValidateNested } from "class-validator";

const REGIONS = ["outskirts", "market", "arena", "harbor", "inner", "palace", "forest"] as const;
const EVENT_KINDS = ["quest", "market", "world", "gm", "system"] as const;
const TONES = ["personal", "world", "warning"] as const;

export class EyeRecentEventDto {
  @IsString() @MaxLength(80) title!: string;
  @IsString() @MaxLength(240) text!: string;
  @IsIn(EVENT_KINDS) kind!: typeof EVENT_KINDS[number];
}
export class EyeRecentObservationDto {
  @IsString() @MaxLength(80) title!: string;
  @IsString() @MaxLength(200) body!: string;
  @IsIn(TONES) tone!: typeof TONES[number];
}
export class EyeRequestDto {
  @IsString() @Length(1, 22) playerName!: string;
  @IsIn(REGIONS) region!: typeof REGIONS[number];
  @IsInt() @Min(1) @Max(100) level!: number;
  @IsArray() @ArrayMaxSize(5) @ValidateNested({ each: true }) @Type(() => EyeRecentEventDto) recentEvents!: EyeRecentEventDto[];
  @IsOptional() @IsArray() @ArrayMaxSize(3) @ValidateNested({ each: true }) @Type(() => EyeRecentObservationDto) recentObservations?: EyeRecentObservationDto[];
}
