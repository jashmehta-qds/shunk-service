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
  max_supply: number | null; // `null` if no max supply
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // ISO date string
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // ISO date string
  roi: {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string; // ISO date string
  sparkline_in_7d: {
    price: number[];
  };
}
@Injectable()
export class CoingeckoService {
  private readonly logger = new Logger(CoingeckoService.name);
  private readonly apiUrl =
    'https://api.coingecko.com/api/v3/coins/list?include_platform=true';

  private readonly apiUrl2 =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=true';

  private readonly apiUrlpage2 =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=true';
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(TokensData.name)
    private readonly tokenPriceModel: Model<TokensDocument>,
  ) {}

  async onModuleInit() {
    // await this.fetchTokenPlatforms();
  }

  @Cron(CronExpression.EVERY_5_MINUTES) // Runs daily at midnight
  async fetchTokenPlatforms() {
    try {
      const key = this.configService.get<string>('CG_KEY');
      const response_market = [];
      const res1 = await axios.get<CgMarketResponse[]>(this.apiUrl2, {
        headers: { 'x-cg-demo-api-key': key },
      });
      const res2 = await axios.get<CgMarketResponse[]>(this.apiUrlpage2, {
        headers: { 'x-cg-demo-api-key': key },
      });
      response_market.push(...res1.data);
      response_market.push(...res2.data);

      const response_platform = await axios.get<CgPlatformResponse[]>(
        this.apiUrl,
      );

      const mergedData = response_market?.map((res) => {
        return {
          ...res,
          ...response_platform.data.find((p) => p.id === res.id),
        };
      });
      await this.tokenPriceModel.deleteMany();

      const res = mergedData.map(
        (data) =>
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
          }),
      );
      await this.tokenPriceModel.insertMany(res);

      this.logger.log('Token prices updated successfully');
    } catch (error) {
      this.logger.error('Error fetching token prices', error);
      throw new Error(`Failed to fetch token prices: ${error.message}`);
    }
  }

  async getAllData() {
    return this.tokenPriceModel
      .find({
        $or: [
          //   { 'platforms.ethereum': { $exists: true, $ne: null } },
          { 'platforms.base': { $exists: true, $ne: null } },
        ],
      })
      .exec();
  }
}
