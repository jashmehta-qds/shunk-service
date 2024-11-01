import { PartialType } from '@nestjs/swagger';
import { CreateBundlerDto } from './create-bundler.dto';

export class UpdateBundlerDto extends PartialType(CreateBundlerDto) {}
