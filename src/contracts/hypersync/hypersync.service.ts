import {
  HypersyncClient,
  presetQueryLogsOfEvent,
} from '@envio-dev/hypersync-client';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HypersyncService {
  constructor() {}

  async onModuleInit() {
    // Trigger fetchData method on module initialization
    await this.getContractData();
  }
  @Cron(CronExpression.EVERY_YEAR) // Run every hour
  async getContractData() {
    console.log(
        `Query started`,
      );
    // Create hypersync client using the mainnet hypersync endpoint
    const client = HypersyncClient.new({
      url: 'https://base.hypersync.xyz',
    });

    // address to get logs from
    const usdt_contract = '0x39C43b97b9A42Dbd9440A57AE4c0867271C548f0';

    // topic0 of transaction event signature (hash of event signature)
    // query will return logs of this event
    const event_topic_0 =
      '0x20078448f506530c56be7525b48b80354771a5f65e3814cc030138438319ba27';

    // query is inclusive of from_block, exclusive of to_block so this will return 49 blocks
    let query = presetQueryLogsOfEvent(
      usdt_contract,
      event_topic_0,
      17_000_000,
    );

    console.log('Running the query...');

    // Run the query once, the query is automatically paginated so it will return when it reaches some limit (time, response size etc.)
    //  there is a nextBlock field on the response object so we can set the fromBlock of our query to this value and continue our query until
    // res.nextBlock is equal to res.archiveHeight or query.toBlock in case we specified an end block.
    const res = await client.get(query);

    console.log(
      `Query returned ${JSON.stringify(res.data.logs)} logs of transfer events from contract ${usdt_contract}`,
    );
  }
}
