import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BagDetails, BagDetailsSchema } from 'src/bag/schemas/bag.schema';
import { BundlerController } from './bundler.controller';
import { BundlerService } from './bundler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BagDetails.name, schema: BagDetailsSchema },
    ]),
  ],
  controllers: [BundlerController],
  providers: [BundlerService],
})
export class BundlerModule {}
