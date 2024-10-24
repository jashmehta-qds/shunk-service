// src/leaderboard/leaderboard.controller.ts
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { BagService } from './bag.service';

@Controller()
export class BagController {
  constructor(private readonly bagService: BagService) {}

  @Get('bag/:id')
  async getBag(@Param('id') id: string) {
    const bag = await this.bagService.getBag(Number(id));
    if (!bag) {
      throw new NotFoundException(`Bag with ID ${id} not found`);
    }
    return bag;
  }

  @Get()
  async getData() {
    return this.bagService.getAllData();
  }
}
