import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryBatchDto } from './create-inventorybatch.dto';

export class UpdateInventoryBatchDto extends PartialType(
  CreateInventoryBatchDto,
) {}
