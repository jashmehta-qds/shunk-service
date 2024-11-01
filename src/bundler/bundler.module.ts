import { Module } from '@nestjs/common';
import { BundlerService } from './bundler.service';
import { BundlerController } from './bundler.controller';

@Module({
  controllers: [BundlerController],
  providers: [BundlerService]
})
export class BundlerModule {}
