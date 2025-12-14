import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './CreateSessionDto';

export class UpdateSessionDto extends PartialType(
  OmitType(CreateSessionDto, ['userId'] as const),
) {}
