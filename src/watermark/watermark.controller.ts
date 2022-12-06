import {
  Post,
  Body,
  Req,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import { GetOrganization } from 'src/organization/decorators/getOrganization.decorator';
import { FileDto } from 'src/organization/dto/default.dto';
import {
  OrganizationDto,
  OrganizationTestDto,
} from 'src/organization/dto/organization.dto';
import { BasicSwaggerController } from 'src/utils/nestMethods.utils';
import { ApplySwaggerHeadersFields } from 'src/utils/swagger.utils';
import { CustomWatermarkWithLogoDto } from './dto/watermarkTokens.dto';
import { WatermarkService } from './watermark.service';

@BasicSwaggerController('Watermark')
export class WatermarkController {
  constructor(private readonly watermarkService: WatermarkService) {}

  @ApplySwaggerHeadersFields()
  @Post('/test')
  async test(@Body() organizationDto: OrganizationTestDto) {
    console.log(organizationDto);
    return await this.watermarkService.testCreateSignature(
      organizationDto.secret,
      organizationDto.name,
      organizationDto.identifier,
      organizationDto.fileName,
    );
  }
  @ApplySwaggerHeadersFields()
  @UseInterceptors(FileInterceptor('attachment'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        attachment: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('/default')
  async defaultAddWatermark(
    @GetOrganization() organization: OrganizationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.watermarkService.defaultAddWatermark(organization, file);
  }

  @ApplySwaggerHeadersFields()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        attachment: {
          type: 'string',
          format: 'binary',
        },
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('/custom')
  async addWaterMarkWithPadding(
    @GetOrganization() organization: OrganizationDto,
    @Query() query: CustomWatermarkWithLogoDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const attachment = files.find((file) => {
      return file.fieldname == 'attachment';
    });

    if (!attachment) throw new BadRequestException('Attachment must be a FILE');

    let logo: any =
      files.find((file) => {
        return file.fieldname == 'logo';
      }) || query.logoUrl;
    const validateExtName =
      logo?.originalname?.match(/\.[0-9a-z]+$/i)[0].toLowerCase() ||
      logo?.match(/\.[0-9a-z]+$/i)[0].toLowerCase();

    if (validateExtName && validateExtName != '.png')
      throw new BadRequestException('Invalid logo');

    if (!logo) {
      if (organization.client.defaults.watermark) {
        logo = organization.client.defaults.watermark.logo.url;
      } else throw new BadRequestException('Logo is not provided');
    }

    query.logo = logo.buffer || logo;
    query.attachment = attachment;
    return await this.watermarkService.addWaterMarkWithPadding(
      organization,
      query,
    );
  }
}
