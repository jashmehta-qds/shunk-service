// src/leaderboard/leaderboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('leaderboard')
  async getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }
}
