import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { TokensData, TokensDocument } from './schemas/token-price.scheme';

interface CgPlatformResponse {
  id: string;
  symbol: string;
  name: string;
  platforms: Record<string, string>;
}

export interface CgMarketResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
  sparkline_in_7d: { price: number[] };
}

@Injectable()
export class CoingeckoService {
  private readonly logger = new Logger(CoingeckoService.name);
  private readonly apiUrl = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true';
  private readonly apiMarketsUrl = 'https://api.coingecko.com/api/v3/coins/markets';
  
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(TokensData.name) private readonly tokenPriceModel: Model<TokensDocument>,
  ) {}

  async onModuleInit() {
    await this.fetchTokenPlatforms();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async fetchTokenPlatforms() {
    try {
      const key = this.configService.get<string>('CG_KEY');
      const perPage = 250;
      const totalPages = 6;

      const marketData = await this.fetchMarketData(totalPages, perPage, key);
      const platformData = await this.fetchPlatformData();

      const mergedData = marketData.map((market) => ({
        ...market,
        platforms: platformData.find((p) => p.id === market.id)?.platforms || {},
      }));

      await this.tokenPriceModel.deleteMany();

      const documents = mergedData.map((data) => 
        new this.tokenPriceModel({
          id: data.id,
          name: data.name,
          symbol: data.symbol,
          priceUSD: data.current_price,
          platforms: data.platforms,
          icon: data.image,
          marketCap: data.market_cap,
          percentChange: data.price_change_percentage_24h,
          priceChange: data.price_change_24h,
          tvl: data.total_volume,
          sparkline_price_in_7d: data.sparkline_in_7d?.price ?? [],
          fetchedAt: new Date().getTime(),
        })
      );

      await this.tokenPriceModel.insertMany(documents);
      this.logger.log('Token prices updated successfully');
    } catch (error) {
      this.logger.error('Error fetching token prices', error);
      throw new Error(`Failed to fetch token prices: ${error.message}`);
    }
  }

  private async fetchMarketData(totalPages: number, perPage: number, key: string) {
    const requests = Array.from({ length: totalPages }, (_, i) => 
      axios.get<CgMarketResponse[]>(
        `${this.apiMarketsUrl}?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${i + 1}&sparkline=true`,
        { headers: { 'x-cg-demo-api-key': key } }
      )
    );

    const responses = await Promise.all(requests);
    return responses.flatMap((res) => res.data);
  }

  private async fetchPlatformData() {
    const response = await axios.get<CgPlatformResponse[]>(this.apiUrl);
    return response.data;
  }

  async getAllData() {
    return this.tokenPriceModel
      .find({ 'platforms.base': { $exists: true, $ne: null } })
      .exec();
  }
}
