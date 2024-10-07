// src/leaderboard/leaderboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bag, Fees } from './schemas/bag';
import { TimeFrame } from 'src/chart/schemas/chart.schema';

@Injectable()
export class BagService {
  private leaderboardData: Bag[];

  constructor(@InjectModel(Bag.name) private leaderboardModel: Model<Bag>) {
    // Initialize with random data
    this.leaderboardData = this.generateRandomData(10);
  }

  //random data generator for leaderboard
  private generateRandomData(count: number): Bag[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: i,
        isFavourite: Math.random() < 0.5,
        name: `Fund ${i}`,
        code: `FND${i}`,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        coins: [
          {
            name: 'wsteth',
            allocation: Math.ceil(Math.random() * 10),
          },
          {
            name: 'usdc',
            allocation: Math.ceil(Math.random() * 10),
          },
          {
            name: 'prime',
            allocation: Math.ceil(Math.random() * 10),
          },
          {
            name: 'mog',
            allocation: Math.ceil(Math.random() * 10),
          },
        ],
        aum: `$${(Math.random() * 10).toFixed(2)}m`,
        price: (Math.random() * 2000).toFixed(2),
        change: (Math.random() * 100 - 50).toFixed(2),
        chartData: [
          {
            id: TimeFrame.ONE_MONTH,
            data: this.generateChartData(50, TimeFrame.ONE_MONTH),
          },
        ],
        fees: [
          {
            id: Fees.ENTRY_FEES,
            data: Math.ceil(Math.random() * 10),
          },
          {
            id: Fees.EXIT_FEES,
            data: Math.ceil(Math.random() * 10),
          },
          {
            id: Fees.PERFORMANCE_FEES,
            data: Math.ceil(Math.random() * 10),
          },
          {
            id: Fees.MANAGEMENT_FEES,
            data: Math.ceil(Math.random() * 10),
          },
        ],
        favoriteCounts: Math.ceil(Math.random() * 1000) + 50,
      });
    }
    return data;
  }
  private generateChartData(count: number, interval: TimeFrame) {
    const now = Date.now();
    const timeIntervals = {
      '1D': 24 * 60 * 60 * 1000, // 1 day in milliseconds
      '1W': 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
      '1M': 30 * 24 * 60 * 60 * 1000, // 1 month in milliseconds
      '1Y': 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    };

    const timeSpan = timeIntervals[interval];
    const intervalSize = timeSpan / count;

    const data = Array.from({ length: count }, (_, i) => ({
      x: now - i * intervalSize, // Epoch time
      y: Math.floor(Math.random() * 1000) + 100, // Random y-value
    }));

    return data.reverse(); // Reversing to have earliest first
  }
  async getBag(id: number): Promise<Bag | undefined> {
    return this.leaderboardData.find((item) => item.id === id);
  }
}
