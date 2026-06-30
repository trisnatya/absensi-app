import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  office_latitude?: number;

  @IsOptional()
  @IsNumber()
  office_longitude?: number;

  @IsOptional()
  @IsString()
  work_start?: string;

  @IsOptional()
  @IsString()
  work_end?: string;
}
