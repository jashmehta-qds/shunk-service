import { Test, TestingModule } from '@nestjs/testing';
import { BundlerController } from './bundler.controller';
import { BundlerService } from './bundler.service';

describe('BundlerController', () => {
  let controller: BundlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BundlerController],
      providers: [BundlerService],
    }).compile();

    controller = module.get<BundlerController>(BundlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
