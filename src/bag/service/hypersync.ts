import {
  HypersyncClient,
  presetQueryLogsOfEvent,
} from '@envio-dev/hypersync-client';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Interface } from 'ethers';
import { Model } from 'mongoose';
import { BagDetails, BagDetailsDocument } from 'src/bag/schemas/bag.schema';
import { ShunkFactoryABI } from '../../contracts/abi/shunkfactory';

@Injectable()
export class HypersyncService {
  private readonly logger = new Logger(HypersyncService.name);
  private readonly shunkFactoryContract = new Interface(ShunkFactoryABI);

  constructor(
    @InjectModel(BagDetails.name)
    private readonly bagDetailsModel: Model<BagDetailsDocument>,
  ) {}

  async onModuleInit() {
    await this.getContractData();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async getContractData() {
    this.logger.log('Query started');

    const client = HypersyncClient.new({
      url: 'https://base.hypersync.xyz',
    });

    const contractAddress = '0x39C43b97b9A42Dbd9440A57AE4c0867271C548f0';
    const eventTopic0 =
      '0x20078448f506530c56be7525b48b80354771a5f65e3814cc030138438319ba27';

    let query = presetQueryLogsOfEvent(
      contractAddress,
      eventTopic0,
      17_000_000,
    );

    this.logger.log('Running the query...');

    const res = await client.get(query);

    for (const log of res.data.logs) {
      try {
        const decodedLog = this.decodeLog(log);
        await this.storeDecodedLog(decodedLog);
        this.logger.log(
          `Decoded and stored event: ${JSON.stringify(decodedLog)}`,
        );
      } catch (error) {
        this.logger.error(
          `Error processing log: ${error.message}`,
          error.stack,
        );
      }
    }

    this.logger.log('Query finished.');
  }

  private decodeLog(log: any) {
    return this.shunkFactoryContract.parseLog({
      topics: log.topics.filter((t) => !!t),
      data: log.data ?? '',
    });
  }

  private async storeDecodedLog(decodedLog: any) {
    const tokenAddresses = decodedLog.args[4]?.[0]?.filter(
      (res, idx) => (idx + 1) % 2 > 0,
    );

    const allocation = decodedLog.args[4]?.[0]?.filter(
      (res, idx) => (idx + 1) % 2 === 0,
    );

    const bagDetails = new this.bagDetailsModel({
      creator: decodedLog.args[0],
      name: decodedLog.args[1],
      symbol: decodedLog.args[2],
      network: 8453,
      tokenAllocation: [
        {
          tokenAddresses,
          allocation,
          timestamp: new Date().getTime(),
        },
      ],
    });

    await bagDetails.save();
  }
}
