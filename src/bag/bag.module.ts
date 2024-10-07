// src/leaderboard/leaderboard.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BagController } from './bag.controller';
import { BagService } from './bag.service';
import { Bag, BagSchema } from './schemas/bag';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bag.name, schema: BagSchema }])],
  controllers: [BagController],
  providers: [BagService],
})
export class BagModule {}
