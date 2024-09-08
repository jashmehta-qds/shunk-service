import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokensDocument = TokensData & Document;
interface Platforms {
  [key: string]: string | undefined; // Allow for additional platforms
}
@Schema()
export class TokensData {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  symbol: string;
  @Prop({ type: Map, of: String })
  platforms: Platforms;
  @Prop()
  priceUSD: number;
  @Prop()
  icon: string;
  @Prop()
  marketCap: number;
  @Prop()
  percentChange: number;
  @Prop()
  priceChange: number;
  @Prop()
  tvl: number;
  @Prop()
  fetchedAt: string;
  @Prop()
  sparkline_price_in_7d: number[]
}

export const TokensDataScheme = SchemaFactory.createForClass(TokensData);
