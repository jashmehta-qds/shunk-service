import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UniswapDataDocument = UniswapData & Document;

@Schema()
export class UniswapData {
  @Prop({ required: true })
  network: 1 | 8453;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  icon: string;

  @Prop()
  tvlUSD: number;

  @Prop()
  tvl: string;

  @Prop()
  volume: number;

  @Prop()
  volumeUSD: number;
}

export const UniswapDataSchema = SchemaFactory.createForClass(UniswapData);
