import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OrganizationDocument } from '../entities/organization.entity';

export class OrganizationDto {
  signature: string;
  identifier: string;
  client: OrganizationDocument;
}

export class OrganizationTestDto {
  @IsString()
  @ApiProperty({
    type: String,
  })
  secret: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  name: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  identifier: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  fileName: string;
}
