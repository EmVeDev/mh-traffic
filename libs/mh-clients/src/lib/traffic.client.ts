import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {firstValueFrom} from 'rxjs';
import {TrafficContract, TRAFFIC_PATTERNS} from '@mh-traffic/mh-types';

export const TRAFFIC_CLIENT_TOKEN = 'TRAFFIC_CLIENT_TOKEN';

@Injectable()
export class TrafficClient {
  constructor(@Inject(TRAFFIC_CLIENT_TOKEN) private readonly client: ClientProxy) {
  }

  getStatus(): Promise<TrafficContract[typeof TRAFFIC_PATTERNS.getStatus]['response']> {
    return firstValueFrom(this.client.send(TRAFFIC_PATTERNS.getStatus, TRAFFIC_PATTERNS.getStatus));
  }
}
