import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TokensModule } from './tokens/tokens.module';
import { ChartModule } from './chart/chart.module.';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { BagModule } from './bag/bag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the ConfigModule globally available
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TokensModule,
    ChartModule,
    LeaderboardModule,
    BagModule,
  ],
})
export class AppModule {}
