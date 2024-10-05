// src/leaderboard/schemas/leaderboard.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ type: [String], required: true })
  coins: string[];

  @Prop({ required: true })
  aum: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  change: string;

  @Prop({ type: Object, required: true })
  chartData: {
    id: string;
    data: { x: string; y: number }[];
  }[];
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
