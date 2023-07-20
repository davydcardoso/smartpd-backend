import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*', credentials: false },
  });
  app.setGlobalPrefix('/v1/smartpd');
  app.useStaticAssets(join(__dirname, '..', '..', 'upload'), {
    prefix: '/v1/smartpd/public',
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3001);
}

bootstrap();
