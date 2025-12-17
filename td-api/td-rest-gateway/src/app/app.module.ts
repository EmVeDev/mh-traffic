import { Module } from '@nestjs/common';
import { TrafficController } from './traffic/traffic.controller';
import {TrafficClientModule} from "@mh-traffic/mh-clients";

@Module({
  imports: [TrafficClientModule],
  controllers: [TrafficController],
})
export class AppModule {}
