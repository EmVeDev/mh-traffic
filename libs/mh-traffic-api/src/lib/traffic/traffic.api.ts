
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrafficHttpEndpoints } from '../endpoints/traffic.endpoints';
import type { TrafficStatusResponseDto } from '@mh-traffic/mh-types';

@Injectable({ providedIn: 'root' })
export class TrafficApi {
  private readonly http = inject(HttpClient);

  getStatus() {
    return this.http.get<TrafficStatusResponseDto>(TrafficHttpEndpoints.status());
  }
}
