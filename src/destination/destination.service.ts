import { BadRequestException, Injectable } from '@nestjs/common';
import { DestinationDto } from './dto/destination.dto';
@Injectable()
export class DestinationService {
  constructor() {}

  sumPadding(arrayOfPadding: string[], destinationDto: DestinationDto) {
    const paddingObject = {
      x: 0,
      y: 0,
    };

    for (let i = 0; i < arrayOfPadding.length; i++) {
      const isPercentage = arrayOfPadding[i].endsWith('%');

      //(destinationDto.height * parseInt(arrayOfPadding[i].split("%")[0])) / 100 ): parseInt(arrayOfPadding[i].split("px")[0]))
      if (i == 0) {
        paddingObject.y = isPercentage
          ? (destinationDto.height *
              parseInt(arrayOfPadding[i].split('%')[0])) /
            100
          : parseInt(arrayOfPadding[i].split('px')[0]);
      } else {
        paddingObject.x = isPercentage
          ? (destinationDto.width * parseInt(arrayOfPadding[i].split('%')[0])) /
            100
          : parseInt(arrayOfPadding[i].split('px')[0]);
      }
    }

    return paddingObject;
  }

  calculator(
    formula: string[],
    destinationDto: DestinationDto,
    padding: { x: number; y: number } = { x: 0, y: 0 },
  ) {
    let returnedObj = {
      x: 0,
      y: 0,
    };
    const destinations = {
      TOP: () => {
        returnedObj.y =
          destinationDto.height - destinationDto.logoHeight - padding.y;
      },
      LEFT: () => {
        returnedObj.x = returnedObj.x + padding.x;
      },
      RIGHT: () => {
        returnedObj.x =
          destinationDto.width - destinationDto.logoWidth - padding.x;
      },
      BOTTOM: () => {
        returnedObj.y = returnedObj.y + padding.y;
      },
      CENTER: () => {
        if (returnedObj.y == 0)
          returnedObj.y =
            (destinationDto.height - destinationDto.logoHeight) / 2;
        if (returnedObj.x == 0)
          returnedObj.x = (destinationDto.width - destinationDto.logoWidth) / 2;
      },
    };

    for (let i = 0; i < formula.length; i++) {
      destinations[formula[i]]();
    }

    return returnedObj;
  }

  //TOP-CENTER
  FORMULA_CODE_4(formula: string[], destinationDto: DestinationDto) {
    //TOP=10,LEFT=10 //TOP , 10 , LEFT , 10

    const positions = [formula[0], formula[2]]; //TOP,LEFT
    const padding = [formula[1], formula[3]];

    return this.calculator(
      positions,
      destinationDto,
      this.sumPadding(padding, destinationDto),
    );
  }

  FORMULA_CODE_2_DEFAULT(formula: string[], destinationDto: DestinationDto) {
    //TOP,LEFT
    return this.calculator(formula, destinationDto);
  }

  FORMULA_CODE_2_CUSTOM(formula: string[], destinationDto: DestinationDto) {
    //160,155
    if (
      parseInt(formula[0]) > destinationDto.height ||
      parseInt(formula[1]) > destinationDto.width
    )
      throw new BadRequestException('Invalid positions');

    return {
      y: parseInt(formula[0]),
      x: parseInt(formula[1]),
    };
  }

  destinationCalculator(destinationDto: DestinationDto) {
    const regex = /[,=]/g;
    //TOP=10,LEFT=10
    const formula = destinationDto.position.split(regex);
    const supportedLength = [2, 4];
    if (!supportedLength.includes(formula.length))
      throw new BadRequestException('Not supported formula');

    return this[
      `FORMULA_CODE_${formula.length}${
        formula.length == 2
          ? isNaN(Number(formula[0]))
            ? '_DEFAULT'
            : '_CUSTOM'
          : ''
      }`
    ](formula, destinationDto);
  }
}
