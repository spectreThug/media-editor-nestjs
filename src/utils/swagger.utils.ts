import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiHeader,
  ApiHeaders,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

interface ClassConstructor {
  new (...args: any[]): {};
}
export function ApplySwaggerHeadersFields() {
  return applyDecorators(
    ApiHeaders([
      { name: 'signature', allowEmptyValue: false, required: true },
      { name: 'identifier', allowEmptyValue: false, required: true },
    ]),
  );
}
class ParamsDto {
  response: number;

  isArray: boolean;

  operation: {
    summary: string;
    deprecated?: boolean;
    description?: string;
  };

  dto: ClassConstructor;

  description: string;
}

class ErrorClass {
  @ApiProperty({
    type: Number,
    name: 'statusCode',
    description: 'error statusCode',
    example: 0,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    name: 'message',
    description: 'error message',
    example: 'Error message',
  })
  message: string;

  @ApiProperty({
    type: String,
    name: 'error',
    description: 'error error',
    example: 'error',
  })
  error: string;
}
export function BasicApiDecorators(ParamsDto: ParamsDto) {
  return applyDecorators(
    ApiOperation(ParamsDto.operation),

    // custom api response
    ApiResponse({
      type: ParamsDto.dto,
      isArray: ParamsDto.isArray,
      status: ParamsDto.response,
      description: `${ParamsDto.response} - ${ParamsDto.description}`,
    }),
    //bad request response
    ApiResponse({
      type: ErrorClass,
      status: 0,
      description: `${HttpStatus.BAD_REQUEST} - Bad Request || ${HttpStatus.NOT_FOUND} - Not Found || ${HttpStatus.FORBIDDEN} - Forbidden || ${HttpStatus.INTERNAL_SERVER_ERROR} - Internal Server Error`,
    }),
  );
}

export class DefaultResponseDto {
  @ApiProperty({
    type: Number,
    name: 'statusCode',
    description: 'Status code of the response',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    name: 'status',
    description: 'Status of the response',
    example: 'OK',
  })
  status: number;

  @ApiProperty({
    type: String,
    name: 'message',
    description: 'Message of the response',
    example: 'Resource retrieved successfully',
  })
  message: string;
}
