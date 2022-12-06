import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegrationService } from 'src/constants/enums.constants';
import {
  Organization,
  OrganizationDocument,
} from './entities/organization.entity';
@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  test() {
    this.organizationModel.create({
      name: 'ZED_TALENTS',
      integrationService: [IntegrationService.Watermark],
      identifier: 'a4529caa',
      secret: 'c9647003fec1968c1a6953ad4d7ed7',
    });
  }

  getAll() {
    return this.organizationModel.find({ removed: false });
  }
}
