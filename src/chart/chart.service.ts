// src/chart/chart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChartData, TimeFrame } from './schemas/chart.schema';

@Injectable()
export class ChartService {
  constructor(
    @InjectModel(ChartData.name) private chartDataModel: Model<ChartData>,
  ) {}

  private generateChartData(
    timeFrame: TimeFrame,
  ): { timestamp: number; price: number }[] {
    const now = Date.now();
    const data = [];
    let startTime: number;
    let interval: number;

    switch (timeFrame) {
      case TimeFrame.ONE_DAY:
        startTime = now - 24 * 60 * 60 * 1000;
        interval = 5 * 60 * 1000;
        break;
      case TimeFrame.ONE_WEEK:
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        interval = 1 * 60 * 60 * 1000;
        break;
      case TimeFrame.ONE_MONTH:
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        interval = 6 * 60 * 60 * 1000;
        break;
      case TimeFrame.ONE_YEAR:
        startTime = now - 365 * 24 * 60 * 60 * 1000;
        interval = 24 * 60 * 60 * 1000;
        break;
      case TimeFrame.ALL:
        startTime = now - 5 * 365 * 24 * 60 * 60 * 1000;
        interval = 7 * 24 * 60 * 60 * 1000;
        break;
    }

    let currentPrice = 100 + Math.random() * 900;
    for (let timestamp = startTime; timestamp <= now; timestamp += interval) {
      currentPrice += (Math.random() - 0.5) * 10;
      currentPrice = Math.max(0, currentPrice);

      data.push({ timestamp, price: parseFloat(currentPrice.toFixed(2)) });
    }

    return data;
  }

  async getChartData(
    tradeCurrency: string,
    quoteCurrency: string,
    timeFrame: TimeFrame,
  ): Promise<ChartData> {
    const chartData = new this.chartDataModel({
      tradeCurrency,
      quoteCurrency,
      timeFrame,
      data: this.generateChartData(timeFrame),
    });

    //  want to save the data to the database, uncomment the next line
    // await chartData.save();

    return chartData;
  }
}
