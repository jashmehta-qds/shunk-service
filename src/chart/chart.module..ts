import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { ChartData, ChartDataSchema } from './schemas/chart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChartData.name, schema: ChartDataSchema },
    ]),
  ],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
