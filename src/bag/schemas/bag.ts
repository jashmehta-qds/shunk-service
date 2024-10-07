// src/leaderboard/schemas/leaderboard.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TimeFrame } from 'src/chart/schemas/chart.schema';
import { Leaderboard } from 'src/leaderboard/schemas/leaderboard.schema';

export enum Fees {
  MANAGEMENT_FEES = 'Management Fees',
  PERFORMANCE_FEES = 'Performance Fees',
  ENTRY_FEES = 'Entry Fees',
  EXIT_FEES = 'Exit Fees',
}

@Schema()
export class Bag extends Leaderboard {
  @Prop({ type: Object, required: true })
  chartData: {
    id: TimeFrame;
    data: { x: string; y: number }[];
  }[];

  @Prop({ type: Object, required: true })
  fees: {
    id: Fees;
    data: string;
  }[];

  @Prop({ type: String })
  favoriteCounts: string;
}

export const BagSchema = SchemaFactory.createForClass(Bag);
