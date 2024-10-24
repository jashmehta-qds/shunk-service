// src/leaderboard/leaderboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeFrame } from 'src/chart/schemas/chart.schema';
import { Bag, BagDocument, Fees } from './schemas/bag';
import { BagDetails, BagDetailsDocument } from './schemas/bag.schema';

@Injectable()
export class BagService {
  private leaderboardData: Bag[];

  constructor(
    @InjectModel(Bag.name) private readonly leaderboardModel: Model<BagDocument>,
    @InjectModel(BagDetails.name) private readonly bagDetailsModel: Model<BagDetailsDocument>,
  ) {
    this.leaderboardData = this.generateRandomData(10);
  }

  // Generate random leaderboard data
  private generateRandomData(count: number): Bag[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      isFavourite: Math.random() < 0.5,
      name: `Fund ${i}`,
      code: `FND${i}`,
      address: this.generateRandomAddress(),
      coins: this.generateCoins(),
      aum: `$${(Math.random() * 10).toFixed(2)}m`,
      price: (Math.random() * 2000).toFixed(2),
      change: (Math.random() * 100 - 50).toFixed(2),
      chartData: [{ id: TimeFrame.ONE_MONTH, data: this.generateChartData(50, TimeFrame.ONE_MONTH) }],
      fees: this.generateFees(),
      favoriteCounts: Math.ceil(Math.random() * 1000) + 50,
    })) as unknown as Bag[];
  }

  // Generate random wallet address
  private generateRandomAddress(): string {
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  }

  // Generate random coins
  private generateCoins() {
    const coinNames = ['wsteth', 'usdc', 'prime', 'mog'];
    return coinNames.map((name) => ({
      name,
      allocation: Math.ceil(Math.random() * 10),
    }));
  }

  // Generate random fees
  private generateFees() {
    const feeTypes = [Fees.ENTRY_FEES, Fees.EXIT_FEES, Fees.PERFORMANCE_FEES, Fees.MANAGEMENT_FEES];
    return feeTypes.map((id) => ({ id, data: Math.ceil(Math.random() * 10) }));
  }

  // Generate chart data with given timeframe and intervals
  private generateChartData(count: number, interval: TimeFrame) {
    const now = Date.now();
    const timeIntervals: Record<TimeFrame, number> = {
      [TimeFrame.ONE_DAY]: 24 * 60 * 60 * 1000,
      [TimeFrame.ONE_WEEK]: 7 * 24 * 60 * 60 * 1000,
      [TimeFrame.ONE_MONTH]: 30 * 24 * 60 * 60 * 1000,
      [TimeFrame.ONE_YEAR]: 365 * 24 * 60 * 60 * 1000,
      [TimeFrame.ALL]: 0
    };

    const intervalSize = timeIntervals[interval] / count;
    return Array.from({ length: count }, (_, i) => ({
      x: now - i * intervalSize,
      y: Math.floor(Math.random() * 1000) + 100,
    })).reverse();
  }

  // Get a specific bag by ID
  async getBag(id: number): Promise<Bag | undefined> {
    return this.leaderboardData.find((bag) => bag.id === id);
  }

  // Retrieve all bag details from the database
  public async getAllData() {
    try {
      return await this.bagDetailsModel.find().exec();
    } catch (error) {
      throw new Error(`Failed to retrieve data: ${error.message}`);
    }
  }
}
