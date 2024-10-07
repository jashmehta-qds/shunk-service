// src/chart/schemas/chart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TimeFrame {
  ONE_DAY = '1D',
  ONE_WEEK = '1W',
  ONE_MONTH = '1M',
  ONE_YEAR = '1Y',
  ALL = 'ALL',
}

@Schema()
export class ChartData extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  tradeCurrency: string;

  @Prop({ required: true })
  quoteCurrency: string;

  @Prop({ type: String, enum: TimeFrame, required: true })
  timeFrame: TimeFrame;

  @Prop({ type: [{ timestamp: Number, price: Number }], required: true })
  data: { timestamp: number; price: number }[];
}

export const ChartDataSchema = SchemaFactory.createForClass(ChartData);
