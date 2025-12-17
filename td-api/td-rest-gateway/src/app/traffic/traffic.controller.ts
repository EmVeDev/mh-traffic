import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TrafficStatusResponseDto } from "@mh-traffic/mh-types";
import {TrafficClient} from '@mh-traffic/mh-clients'
@ApiTags('traffic')
@Controller('traffic')
export class TrafficController {
  constructor(private readonly traffic: TrafficClient) {}

  @Get('status')
  @ApiOkResponse({ type: TrafficStatusResponseDto })
  getStatus(): Promise<TrafficStatusResponseDto> {
    return this.traffic.getStatus();
  }
}
