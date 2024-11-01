import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MintBundlerDto {
  @IsString()
  bagId;

  @IsString()
  @IsIn(['8453'])
  chainId: '8453';

  @IsString()
  sender: string;

  @IsString()
  fromTokenAddress: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  toTokenAddresses: string[];

  @IsNumber()
  @IsOptional()
  slippage?: number;
}
