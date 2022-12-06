import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function BasicSwaggerController(name: string) {
  return applyDecorators(Controller(name.toLowerCase()), ApiTags(name));
}
