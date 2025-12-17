import { TRAFFIC_PATTERNS } from './traffic.patterns';
import {TrafficStatusResponseDto} from "./traffic.types";

export type TrafficContract = {
  [TRAFFIC_PATTERNS.getStatus]: {
    payload: void;
    response: TrafficStatusResponseDto;
  };
};
