import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FundInfo } from '../interfaces/portfolio.interface';

export type PortfolioDocument = Portfolio & Document;

@Schema()
export class Portfolio {
  @Prop({ required: true })
  id: number;

  @Prop({ default: '' })
  bagIcon: string;

  @Prop({ required: true })
  bagName: string;

  @Prop({ required: true })
  bagCode: string;

  @Prop({ required: true })
  totalInvested: number;

  @Prop({ required: true })
  currentValue: number;

  @Prop({ required: true })
  returnValue: number;

  @Prop({ required: true })
  returnsPercentage: number;

  @Prop({ required: true })
  ltp: number;

  @Prop({ type: Object })
  fundInfo: FundInfo;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
