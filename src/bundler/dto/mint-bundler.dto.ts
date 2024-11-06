import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class MintBundlerDto {
  @ApiProperty({
    description: 'The contract address of the bag',
    example: '0x1234abcd...',
  })
  @IsString()
  bagContractAddress: string;

  @ApiProperty({
    description: 'The chain ID',
    example: '8453',
    enum: ['8453'],
  })
  @IsString()
  @IsIn(['8453'])
  chainId: '8453';

  @ApiProperty({
    description: 'The sender address',
    example: '0x5678efgh...',
  })
  @IsString()
  sender: string;

  @ApiProperty({
    description: 'The address of the token to mint from',
    example: '0x9ijklmno...',
  })
  @IsString()
  fromTokenAddress: string;

  @ApiProperty({
    description: 'Slippage percentage for minting (optional)',
    example: 300,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  slippage?: number;

  @ApiProperty({
    description: 'The amount to mint',
    example: 1000,
  })
  @IsNumber()
  amountIn: number;
}
