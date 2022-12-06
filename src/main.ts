import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { json, urlencoded } from 'express';
import * as responseTime from 'response-time';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './errors/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(responseTime());
  app.use(morgan(':method :url :status :response-time ms - :date[web]'));
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));

  //nest config
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  if (process.env.NODE_ENV === 'Development') {
    app.enableCors();

    const swaggerConfig = new DocumentBuilder()
      .setTitle('MEDIA EDITOR API')
      .setDescription(
        'The Main Api Documentation for MEDIA EDITOR Application.',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api-docs', app, document);
  } else {
    const whitelist = [];

    app.use(helmet());

    app.enableCors({
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, origin);
        } else callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    });
  }

  await app.listen(process.env.PORT || 3404);
}
bootstrap();
