import { Controller, Get } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @Get()
  async getData() {
    return this.coingeckoService.getAllData();
  }
}
