import { Injectable, BadRequestException } from '@nestjs/common';
import { WatermarkDto } from './dto/watermarkTokens.dto';
import { PDFDocument } from 'pdf-lib';
import { urlToBuffer } from 'src/utils/helpers.utils';
import { writeFileSync } from 'fs';
import { DestinationService } from 'src/destination/destination.service';
import { createCanvas, loadImage } from 'canvas';
const sizeOf = require('buffer-image-size');
@Injectable()
export class WatermarkTokensService {
  constructor(private destinationService: DestinationService) {}

  //TODO:Handle JPG logo
  async PDF_WATERMARK(settings: WatermarkDto) {
    const target = await PDFDocument.load(settings.attachment.buffer);
    const logo =
      typeof settings.logo == 'string'
        ? await urlToBuffer(settings.logo)
        : settings.logo;

    const targetLogo = await target.embedPng(logo);

    const logoScale = targetLogo.scale(settings.scale);

    if (settings.applyOnAll) {
      const targetPages = target.getPages();
      if (targetPages.length > 50)
        throw new BadRequestException('Too many pages');
      for (let i = 0; i < targetPages.length; i++) {
        const destinations = this.destinationService.destinationCalculator({
          position: settings.position,
          width: targetPages[i].getWidth(),
          height: targetPages[i].getHeight(),
          logoWidth: logoScale.width,
          logoHeight: logoScale.height,
          isReversed: false,
        });
        targetPages[i].drawImage(targetLogo, {
          x: destinations.x,
          y: destinations.y,
          width: logoScale.width,
          height: logoScale.height,
        });
      }
    } else {
      const targetFirstPage = target.getPage(0);
      const destinations = this.destinationService.destinationCalculator({
        position: settings.position,
        width: targetFirstPage.getWidth(),
        height: targetFirstPage.getHeight(),
        logoWidth: logoScale.width,
        logoHeight: logoScale.height,
        isReversed: false,
      });
      targetFirstPage.drawImage(targetLogo, {
        x: destinations.x,
        y: destinations.y,
        width: logoScale.width,
        height: logoScale.height,
      });
    }
    const pdfBytes = await target.save();

    writeFileSync('test.pdf', pdfBytes);

    return pdfBytes;
  }

  async IMAGE_WATERMARK(settings: WatermarkDto) {
    const background = await loadImage(settings.attachment.buffer);
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const logo = await loadImage(settings.logo);
    const destinations = this.destinationService.destinationCalculator({
      position: settings.position,
      width: background.width,
      height: background.height,
      logoWidth: logo.width * settings.scale,
      logoHeight: logo.height * settings.scale,
      isReversed: true,
    });

    ctx.drawImage(
      logo,
      destinations.x,
      destinations.y,
      logo.width * settings.scale,
      logo.height * settings.scale,
    );
    //TODO:Pass file extension in DTO
    // writeFileSync(`test.${dimensions.type}`, canvas.toBuffer());
  }
}
