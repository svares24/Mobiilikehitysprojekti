import { Coords } from './coords';

export interface Point extends Coords {
  point_id: number;
  route_id: number;
}
