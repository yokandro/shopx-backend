import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = (await NestFactory.create(AppModule)) as any;

  app.setGlobalPrefix('rest');
  app.enableCors({ origin: true, credentials: true });

  await app.listen(process.env.PORT || 3000);
};

bootstrap();
