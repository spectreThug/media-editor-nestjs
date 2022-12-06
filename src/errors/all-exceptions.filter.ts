import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (process.env.NODE_ENV === 'Development') {
      console.log(exception);
    }
    if (exception.code && exception.code === 11000) {
      const [[key, value]] = Object.entries(exception.keyValue);
      if (process.env.NODE_ENV === 'Development') {
        return response.status(400).json({
          data: null,
          statusCode: 400,
          message: `This ${key}: ${value} is already exist!`,
          error: 'Bad Request',
        });
      } else {
        return response.status(400).json({
          data: null,
          statusCode: 400,
          //message: `This ${key}: ${value} is already exist!`,
          error: 'Bad Request',
        });
      }
    }

    if (exception.name === 'ValidationError') {
      if (process.env.NODE_ENV === 'Development') {
        return response.status(400).json({
          data: null,
          statusCode: 400,
          message: exception.message,
        });
      } else {
        return response.status(400).json({
          data: null,
          statusCode: 400,
          //message: exception.message,
        });
      }
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (process.env.NODE_ENV === 'Development') {
      response.status(httpStatus).json(exception.response);
    } else {
      response.status(httpStatus).json({
        data: null,
        statusCode: httpStatus,
        message: 'Something went wrong!',
      });
    }
  }
}
