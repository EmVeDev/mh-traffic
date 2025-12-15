import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.TD_TRAFFIC_HOST ?? '0.0.0.0',
      port: Number(process.env.TD_TRAFFIC_PORT ?? 3300),
    },
  });

  await app.listen();
  Logger.log(`td-traffic-service listening (TCP)`);
}

bootstrap();
