import { PeriodName } from './period';

export interface Compound {
  duration: number;
  distance: number;
  period: string;
  type: PeriodName;
}
