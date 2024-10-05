// src/chart/chart.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ChartService } from './chart.service';
import { TimeFrame } from './schemas/chart.schema';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get(':tradeCurrency-:quoteCurrency/:timeFrame')
  async getChartData(
    @Param('tradeCurrency') tradeCurrency: string,
    @Param('quoteCurrency') quoteCurrency: string,
    @Param('timeFrame') timeFrame: TimeFrame,
  ) {
    return this.chartService.getChartData(
      tradeCurrency,
      quoteCurrency,
      timeFrame,
    );
  }
}
