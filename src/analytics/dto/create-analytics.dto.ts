import { IsDate, IsString } from 'class-validator';

export class SalesStatsQueryDto {
  @IsString()
  @IsDate()
  from?: Date;
  @IsString()
  @IsDate()
  to?: Date;
}
