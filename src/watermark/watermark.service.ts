import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { Operations } from 'src/constants/enums.constants';
import { OrganizationDto } from 'src/organization/dto/organization.dto';
import {
  createSignature,
  identifyFile,
  isVerified,
} from 'src/utils/helpers.utils';
import {
  CustomWatermarkWithLogoDto,
  WatermarkDto,
} from './dto/watermarkTokens.dto';
import { WatermarkTokensService } from './watermark_tokens.service';

@Injectable()
export class WatermarkService {
  constructor(
    private cacheManagerService: CacheManagerService,
    private watermarkTokensService: WatermarkTokensService,
  ) {}

  async testCreateSignature(
    secret: string,
    name: string,
    identifier: string,
    fileName: string,
  ) {
    return createSignature(secret, name, identifier, fileName);
  }

  async defaultAddWatermark(
    organization: OrganizationDto,
    file: Express.Multer.File,
  ) {
    if (
      !isVerified(
        organization.client.secret,
        organization.client.identifier,
        organization.client.name,
        file.originalname,
        organization.signature,
      )
    )
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );

    const fileType = identifyFile(file.originalname, Operations.Watermark);
    if (!organization.client.defaults.watermark.logo)
      throw new BadRequestException('There is no default data');
    const { applyOnAll, position, scale, url } =
      organization.client.defaults.watermark.logo;
    let handoverData: WatermarkDto = {
      applyOnAll,
      attachment: file,
      logo: url,
      position,
      scale,
    };

    // if (organization.client.defaults.watermark.text) {
    //   handoverData.defaultSettings.text =
    //     organization.client.defaults.watermark.text;
    // }
    const data: Buffer | Uint8Array | Blob | string =
      await this.watermarkTokensService[fileType.token](handoverData);
  }

  //  const position = y.concat("=", paddingY, ",", x, "=", paddingX);

  async addWaterMarkWithPadding(
    organization: OrganizationDto,
    settings: CustomWatermarkWithLogoDto,
  ) {
    if (
      !isVerified(
        organization.client.secret,
        organization.client.identifier,
        organization.client.name,
        settings.attachment.originalname,
        organization.signature,
      )
    )
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );

    const fileType = identifyFile(
      settings.attachment.originalname,
      Operations.Watermark,
    );

    let handoverData: WatermarkDto = {
      applyOnAll: settings.applyOnAll || false,
      attachment: settings.attachment,
      logo: settings.logo as string | Buffer,
      position: settings.AxisY.concat(
        '=',
        settings.paddingY || '0px',
        ',',
        settings.AxisX,
        '=',
        settings.paddingX || '0px',
      ),
      scale: settings.scale,
    };

    const data: Buffer | Uint8Array | Blob | string =
      await this.watermarkTokensService[fileType.token](handoverData);
  }
}
