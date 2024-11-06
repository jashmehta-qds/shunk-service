import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { BagDetails, BagDetailsDocument } from 'src/bag/schemas/bag.schema';
import { splitNumberIntoRatios } from 'src/utils';
import { MintBundlerDto } from './dto/mint-bundler.dto';

@Injectable()
export class BundlerService {
  private readonly logger = new Logger(BundlerService.name);
  private readonly BASE_URL =
    'https://api.enso.finance/api/v1/shortcuts/bundle';

  constructor(
    @InjectModel(BagDetails.name)
    private readonly bagDetailsModel: Model<BagDetailsDocument>,
    private readonly configService: ConfigService,
  ) {}

  private buildUrl(chainId: string, sender: string): string {
    const url = new URL(this.BASE_URL);
    url.searchParams.set('chainId', chainId);
    url.searchParams.set('fromAddress', sender);
    return url.toString();
  }

  private createRouteAction(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    slippage: string = '300',
  ) {
    return {
      protocol: 'enso',
      action: 'route',
      args: { tokenIn, tokenOut, amountIn, slippage },
    };
  }

  async mint(mintBundlerDto: MintBundlerDto) {
    const { bagContractAddress, amountIn, fromTokenAddress, sender } =
      mintBundlerDto;

    try {
      const ENSO_KEY = this.configService.get<string>('ENSO_KEY');
      if (!ENSO_KEY) {
        throw new UnprocessableEntityException(
          'ENSO_KEY is missing from configuration',
        );
      }

      const selectedBag = await this.bagDetailsModel.findOne({
        contractAddress: new RegExp(`^${bagContractAddress}$`, 'i'),
      });

      if (!selectedBag) {
        throw new NotFoundException(
          `Bag with address: ${bagContractAddress} not found`,
        );
      }

      const strategy = selectedBag.tokenAllocation.pop();
      if (
        !this.isValidAllocation(strategy.allocation, strategy.tokenAddresses)
      ) {
        throw new UnprocessableEntityException(
          `Strategy Allocation issue for bag with address: ${bagContractAddress}`,
        );
      }

      const amountInRatios = splitNumberIntoRatios(
        amountIn,
        strategy.allocation,
      );
      const swapSteps = amountInRatios.map((amount, idx) =>
        this.createRouteAction(
          fromTokenAddress,
          strategy.tokenAddresses[idx],
          amount.toString(),
        ),
      );

      const result = await this.sendToEnso(swapSteps, sender, ENSO_KEY);
      return result.data;
    } catch (error) {
      this.logger.error(`Failed to mint: ${error.message}`);
      throw error;
    }
  }

  private isValidAllocation(
    allocation: number[],
    tokenAddresses: string[],
  ): boolean {
    const totalAllocation = allocation.reduce(
      (sum, value) => sum + Number(value),
      0,
    );
    return (
      totalAllocation === 100_00 && allocation.length === tokenAddresses.length
    );
  }

  private async sendToEnso(swapSteps: any[], sender: string, ensoKey: string) {
    try {
      const response = await axios.post(
        this.buildUrl('8453', sender),
        swapSteps,
        { headers: { Authorization: `Bearer ${ensoKey}` } },
      );
      return response;
    } catch (error) {
      this.logger.error(`Enso API request failed: ${error.response?.data}`);
      throw new UnprocessableEntityException(
        'Failed to execute Enso API request',
      );
    }
  }
}
