import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoingeckoService } from './coingecko.service';
import { TokensData, TokensDataScheme } from './schemas/token-price.scheme';
import {
  UniswapData,
  UniswapDataSchema,
} from './schemas/uniswap-subgraph.schema';
import { TokensController } from './tokens.controller';
import { UniswapService } from './uniswap-subgraph.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UniswapData.name, schema: UniswapDataSchema },
      { name: TokensData.name, schema: TokensDataScheme },
    ]),
  ],
  providers: [UniswapService, CoingeckoService],
  controllers: [TokensController],
})
export class TokensModule {}
