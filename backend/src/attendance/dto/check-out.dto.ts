import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckOutDto {
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
