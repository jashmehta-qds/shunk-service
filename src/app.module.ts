import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { BagModule } from './bag/bag.module';
import { BundlerModule } from './bundler/bundler.module';
import { ChartModule } from './chart/chart.module.';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CacheManagerService } from './shared/cache-manager.service';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      ttl: 5 * 60,
      max: 100,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
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
    BundlerModule,
    PortfolioModule,
  ],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class AppModule {}
