// src/leaderboard/leaderboard.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('leaderboard')
  async getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }

  @Get('bag/:id')
  async getBag(@Param('id') id: string) {
    const bag = await this.leaderboardService.getBag(Number(id));
    if (!bag) {
      throw new NotFoundException(`Bag with ID ${id} not found`);
    }
    return bag;
  }
}
