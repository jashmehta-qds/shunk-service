import { Fees } from 'src/bag/schemas/bag';
import { Portfolio } from '../interfaces/portfolio.interface';

export class PortfolioGenerator {
  private static fundNames = [
    'Alpha Investment',
    'Beta Capital',
    'Gamma Securities',
    'Delta Trust',
    'Epsilon Wealth',
    'Omega Fund',
    'Sigma Finance',
    'Theta Holdings',
    'Zeta Investments',
    'Pi Capital',
  ];

  private static generateRandomCode(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  private static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static generateInvestorPortfolio(count = 10): Portfolio[] {
    return Array.from({ length: count }, (_, index) => {
      const totalInvested = this.generateRandomNumber(1000, 10000);
      const currentValue =
        totalInvested + this.generateRandomNumber(-2000, 3000);
      const returnValue = currentValue - totalInvested;
      const returnsPercentage = parseFloat(
        ((returnValue / totalInvested) * 100).toFixed(2),
      );

      return {
        id: index + 1,
        bagIcon: '',
        bagName: `${this.fundNames[index]} Fund`,
        bagCode: this.generateRandomCode(),
        totalInvested,
        currentValue,
        returnValue,
        returnsPercentage,
        ltp: this.generateRandomNumber(50, 200),
      };
    });
  }

  static generateCreatorPortfolio(count = 10): Portfolio[] {
    return Array.from({ length: count }, (_, index) => {
      const totalInvested = this.generateRandomNumber(5000, 20000);
      const currentValue =
        totalInvested + this.generateRandomNumber(-4000, 6000);
      const returnValue = currentValue - totalInvested;
      const returnsPercentage = parseFloat(
        ((returnValue / totalInvested) * 100).toFixed(2),
      );

      return {
        id: index + 1,
        bagIcon: '',
        bagName: `Creator ${this.fundNames[index]} Series`,
        bagCode: this.generateRandomCode(),
        totalInvested,
        currentValue,
        returnValue,
        returnsPercentage,
        ltp: this.generateRandomNumber(100, 400),
        fundInfo: {
          fees: [
            {
              id: Fees.ENTRY_FEES,
              data: this.generateRandomNumber(0, 4) + '%',
              earning: this.generateRandomNumber(30, 400),
            },
            {
              id: Fees.EXIT_FEES,
              data: this.generateRandomNumber(0, 2) + '%',
              earning: this.generateRandomNumber(20, 4400),
            },
            {
              id: Fees.PERFORMANCE_FEES,
              data: this.generateRandomNumber(0, 3) + '%',
              earning: this.generateRandomNumber(1, 9),
            },
            {
              id: Fees.MANAGEMENT_FEES,
              data: this.generateRandomNumber(0, 5) + '%',
              earning: this.generateRandomNumber(90, 4100),
            },
          ],
          startDate: new Date('12-12-12').getTime(),
          lastModified: new Date().getTime(),
          investorsCount: this.generateRandomNumber(1000, 40000),
        },
      };
    });
  }
}
