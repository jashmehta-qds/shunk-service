import { Fees } from 'src/bag/schemas/bag';

export interface Portfolio {
  id: number;
  bagIcon: string;
  bagName: string;
  bagSymbol: string;
  totalInvested: number;
  currentValue: number;
  returnValue: number;
  returnsPercentage: number;
  ltp: number;
  fundInfo?: FundInfo;
}

export interface FundInfo {
  fees: {
    id: Fees;
    data: string;
    earning: number;
  }[];
  startDate: number;
  lastModified: number;
  investorsCount: number;
}
