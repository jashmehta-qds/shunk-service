import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import fetch from 'cross-fetch';
import { Model } from 'mongoose';

import {
    UniswapData,
    UniswapDataDocument,
} from './schemas/uniswap-subgraph.schema';

@Injectable()
export class UniswapService {
  private client: ApolloClient<any>;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(UniswapData.name)
    private readonly uniswapModel: Model<UniswapDataDocument>,
  ) {
    const key = this.configService.get<string>('GRT_KEY');
    const httpLink = new HttpLink({
      uri: `https://gateway.thegraph.com/api/${key}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`,
      fetch,
    });

    this.client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });
  }

//   async onModuleInit() {
//     // Trigger fetchData method on module initialization
//     await this.fetchData();
//   }

  @Cron(CronExpression.EVERY_YEAR) // Run every hour
  async fetchData() {
    const query = gql`
      {
        tokens(orderBy: volumeUSD, orderDirection: desc) {
          id
          name
          symbol
          decimals
          totalValueLockedUSD
          totalValueLocked
          volume
          volumeUSD
        }
      }
    `;

    try {
      const response = await this.client.query({ query });
      const pools = response.data.tokens;
      const network = 1;
      for (const pool of pools) {
        const newData = new this.uniswapModel({
          network,
          address: pool.id,
          symbol: pool.symbol,
          name: pool.name,
          icon: '',
          tvlUSD: pool.totalValueLockedUSD,
          tvl: pool.totalValueLocked,
          volumeUSD: pool.volumeUSD,
          volume: pool.volume,
        });
        await this.uniswapModel.deleteMany({ network: network }).exec();
        await newData.save();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  async getAllData() {
    return this.uniswapModel.find().exec();
  }
}
