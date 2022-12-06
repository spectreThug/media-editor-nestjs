import { Injectable, BadRequestException } from '@nestjs/common';
import { WatermarkDto } from './dto/watermarkTokens.dto';
import { PDFDocument } from 'pdf-lib';
import { urlToBuffer } from 'src/utils/helpers.utils';
import { writeFileSync } from 'fs';
import { DestinationService } from 'src/destination/destination.service';
@Injectable()
export class WatermarkTokensService {
  constructor(private destinationService: DestinationService) {}

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
}
