export interface Route {
  route_id: number;
  name: string;
  distance: number;
  duration: number;
  created: number; //changed to number from date, due to format issues. Feel free to change.
}
