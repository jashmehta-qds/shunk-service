import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BagDetailsDocument = BagDetails & Document;

interface TokenAllocation {
  tokenAddresses: string[];
  allocation: number[];
  timestamp: number;
}

@Schema()
export class BagDetails {
  @Prop({ required: true })
  creator: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  network: number;

  @Prop({
    type: [
      {
        tokenAddresses: { type: [String], required: true },
        allocation: { type: [String], required: true },
        timestamp: { type: Number, required: true },
      },
    ],
    required: true,
  })
  tokenAllocation: TokenAllocation[];
}

export const BagDetailsSchema = SchemaFactory.createForClass(BagDetails);
