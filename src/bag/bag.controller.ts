// src/leaderboard/leaderboard.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { BagService } from './bag.service';

@Controller()
export class BagController {
  constructor(private readonly leaderboardService: BagService) {}

  @Get('bag/:id')
  async getBag(@Param('id') id: string) {
    const bag = await this.leaderboardService.getBag(Number(id));
    if (!bag) {
      throw new NotFoundException(`Bag with ID ${id} not found`);
    }
    return bag;
  }
}
