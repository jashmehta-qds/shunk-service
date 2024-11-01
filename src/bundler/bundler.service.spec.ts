import { Test, TestingModule } from '@nestjs/testing';
import { BundlerService } from './bundler.service';

describe('BundlerService', () => {
  let service: BundlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BundlerService],
    }).compile();

    service = module.get<BundlerService>(BundlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
