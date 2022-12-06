import { ApiProperty } from '@nestjs/swagger';
import { Transform, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Watermark } from 'src/organization/entities/organization.entity';

export class WatermarkDto {
  attachment: Express.Multer.File;

  logo: Buffer | string;

  position: string;

  scale: number;

  applyOnAll: boolean;
  // text?: {
  //   content: string;
  //   color: string;
  //   position: string;
  // };
}

enum AxisY {
  Top = 'TOP',
  Bottom = 'BOTTOM',
  Center = 'CENTER',
}

enum AxisX {
  Left = 'LEFT',
  Right = 'RIGHT',
  Center = 'CENTER',
}

export class CustomWatermarkWithLogoDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'https://zedtalents.com/static/media/logo.ac1af9d9.png',
    description: 'Logo url [Optional]',
    required: false,
  })
  logoUrl: string;

  @IsString()
  @IsEnum(AxisY)
  @ApiProperty({
    type: String,
    enum: AxisY,
    example: AxisY.Top,
    description: 'Vertical position',
    required: true,
  })
  AxisY: AxisY.Top | AxisY.Bottom | AxisY.Center;

  @IsString()
  @IsEnum(AxisX)
  @ApiProperty({
    type: String,
    enum: AxisX,
    example: AxisX.Left,
    description: 'Horizontal position',
    required: true,
  })
  AxisX: AxisX.Left | AxisX.Right | AxisX.Center;

  @Transform((value) => {
    return Number(value.obj.scale);
  })
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 0.5,
    default: 0.5,
    required: true,
    description: 'Logo scale',
  })
  scale: number;

  @Transform((value) => {
    return Boolean(value.obj.applyOnAll);
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: true,
    description: 'Apply on all pages ? [DOCUMENTS ONLY]',
    required: false,
  })
  applyOnAll?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '10px',
    default: '0px',
    description: 'Vertical padding in pixel & percentage',
    required: false,
  })
  paddingY?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '10px',
    default: '0px',
    description: 'Horizontal padding in pixel & percentage',
    required: false,
  })
  paddingX?: string;

  attachment: Express.Multer.File;

  logo?: any;
}
