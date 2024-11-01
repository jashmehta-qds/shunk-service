import { Injectable } from '@nestjs/common';
import { MintBundlerDto } from './dto/mint-bundler.dto';
const BASE_URL = 'https://api.enso.finance/api/v1/shortcuts/bundle';

@Injectable()
export class BundlerService {
  private buildUrl = (data: { chainId: string; sender: string }): string => {
    const url = new URL(BASE_URL);
    url.searchParams.set('chainId', data.chainId);
    url.searchParams.set(
      'fromAddress',
      data.sender || '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    );
    return url.toString();
  };

  private routeActionBuilder = (
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    slippage?: string,
  ) => {
    return {
      protocol: 'enso',
      action: 'route',
      args: {
        tokenIn,
        tokenOut,
        amountIn,
      },
    };
  };

  mint(mintBundlerDto: MintBundlerDto) {
    return;
  }
}
