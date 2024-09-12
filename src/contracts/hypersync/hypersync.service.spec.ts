import { Test, TestingModule } from '@nestjs/testing';
import { HypersyncService } from './hypersync.service';

describe('HypersyncService', () => {
  let service: HypersyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HypersyncService],
    }).compile();

    service = module.get<HypersyncService>(HypersyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
