// src/leaderboard/leaderboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leaderboard } from './schemas/leaderboard.schema';

@Injectable()
export class LeaderboardService {
  private leaderboardData: Leaderboard[];

  constructor(
    @InjectModel(Leaderboard.name) private leaderboardModel: Model<Leaderboard>,
  ) {
    // Initialize with random data
    this.leaderboardData = this.generateRandomData(10);
  }

  //random data generator for leaderboard
  private generateRandomData(count: number): Leaderboard[] {
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
      });
    }
    return data;
  }

  async getLeaderboard(): Promise<Omit<Leaderboard, 'chartData'>[]> {
    return this.leaderboardData;
  }
  async getBag(id: number): Promise<Leaderboard | undefined> {
    return this.leaderboardData.find((item) => item.id === id);
  }
}
