import { Test, TestingModule } from '@nestjs/testing';
import { WatermarkController } from './watermark.controller';
import { WatermarkService } from './watermark.service';

describe('WatermarkController', () => {
  let controller: WatermarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatermarkController],
      providers: [WatermarkService],
    }).compile();

    controller = module.get<WatermarkController>(WatermarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
