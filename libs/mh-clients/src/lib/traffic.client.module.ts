import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TRAFFIC_CLIENT_TOKEN, TrafficClient } from './traffic.client';

@Module({
  providers: [
    {
      provide: TRAFFIC_CLIENT_TOKEN,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: process.env['TD_TRAFFIC_HOST'] ?? '0.0.0.0',
            port: Number(process.env['TD_TRAFFIC_PORT'] ?? 3300),
          },
        }),
    },
    TrafficClient,
  ],
  exports: [TrafficClient],
})
export class TrafficClientModule {}
