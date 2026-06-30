import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
