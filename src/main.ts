import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*', credentials: false },
  });
  app.setGlobalPrefix('/v1/smartpd');
  app.useStaticAssets(join(__dirname, '..', '..', 'upload'), {
    prefix: '/v1/smartpd/public',
  });

  app.use(
    '/v1/smartpd/test',
    (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).send({
        developer: 'Davyd Cardoso',
        email: 'contato@davydcardoso.com',
        version: '0.0.1',
        lastUpdated: '2023-7-20 11:19',
        application: "SmartPD - Prodata"
      });
    },
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(process.env.API_PORT || 8080);
}

bootstrap();
