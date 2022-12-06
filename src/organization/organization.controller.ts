import { Get } from '@nestjs/common';
import { BasicSwaggerController } from 'src/utils/nestMethods.utils';
import { OrganizationService } from './organization.service';

@BasicSwaggerController('Organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  async test() {
    return await this.organizationService.test();
  }
}
