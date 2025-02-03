import type { Airport } from './AirportType';
import type { Carrier } from './CarrierType';
import type { LegSegment } from './LegSegmentType';

export type Leg = {
  id: string;
  origin: Airport;
  destination: Airport;
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string;
  arrival: string;
  timeDeltaInDays: number;
  carriers: {
    marketing: Carrier[];
    operating?: Carrier[];
    operationType: 'not_operated' | string;
  };
  segments: LegSegment[];
};
