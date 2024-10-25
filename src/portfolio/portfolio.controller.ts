import { Controller, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './interfaces/portfolio.interface';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('investors')
  getInvestorsPortfolio(): Portfolio[] {
    return this.portfolioService.findAllInvested();
  }

  @Get('creators')
  getCreatorsPortfolio(): Portfolio[] {
    return this.portfolioService.findAllCreators();
  }
}
