export const TRAFFIC_PATTERNS = {
  getStatus: 'traffic.getStatus',
} as const;

export type TrafficPattern = (typeof TRAFFIC_PATTERNS)[keyof typeof TRAFFIC_PATTERNS];
