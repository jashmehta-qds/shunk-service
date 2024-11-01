import { Body, Controller, Post } from '@nestjs/common';
import { BundlerService } from './bundler.service';
import { MintBundlerDto } from './dto/mint-bundler.dto';

@Controller('bundler')
export class BundlerController {
  constructor(private readonly bundlerService: BundlerService) {}

  @Post("/mint")
  create(@Body() mintBundlerDto: MintBundlerDto) {
    return this.bundlerService.mint(mintBundlerDto);
  }

}
