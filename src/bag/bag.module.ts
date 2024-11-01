// src/leaderboard/leaderboard.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheManagerService } from 'src/shared/cache-manager.service';
import { BagController } from './bag.controller';
import { BagService } from './bag.service';
import { Bag, BagSchema } from './schemas/bag';
import { BagDetails, BagDetailsSchema } from './schemas/bag.schema';
import { HypersyncService } from './service/hypersync';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bag.name, schema: BagSchema },
      { name: BagDetails.name, schema: BagDetailsSchema },
    ]),
  ],
  controllers: [BagController],
  providers: [BagService, HypersyncService, CacheManagerService],
})
export class BagModule {}
