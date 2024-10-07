// src/leaderboard/schemas/leaderboard.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TimeFrame } from 'src/chart/schemas/chart.schema';

export enum Fees {
  MANAGEMENT_FEES = 'Management Fees',
  PERFORMANCE_FEES = 'Performance Fees',
  ENTRY_FEES = 'Entry Fees',
  EXIT_FEES = 'Exit Fees',
}

@Schema()
export class Leaderboard extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  isFavourite: boolean;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: Array<{
      name: string;
      allocation: string;
    }>,
    required: true,
  })
  coins: string[];

  @Prop({ required: true })
  aum: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  change: string;
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
