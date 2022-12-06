import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class FileDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Required file',
    example: 'file.pdf',
  })
  fileName: string;
}
