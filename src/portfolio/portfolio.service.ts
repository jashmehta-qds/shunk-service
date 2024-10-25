import { Injectable } from '@nestjs/common';
import { Portfolio } from './interfaces/portfolio.interface';
import { PortfolioGenerator } from './utils/portfolio-generator.util';

@Injectable()
export class PortfolioService {
  findAllInvested(): Portfolio[] {
    return PortfolioGenerator.generateInvestorPortfolio(10);
  }

  findAllCreators(): Portfolio[] {
    return PortfolioGenerator.generateCreatorPortfolio(10);
  }
}
