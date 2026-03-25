import { Coords } from '../types';

export const getDistance = (start: Coords, end: Coords): number => {
  const radius = 6371000; //meters

  const deltaLat = ((start.lat - end.lat) * Math.PI) / 180; //transformed to radians
  const deltaLon = ((start.lon - end.lon) * Math.PI) / 180;
  const averageLat = (((start.lat + end.lat) / 2) * Math.PI) / 180;

  const x = deltaLon * Math.cos(averageLat);
  const y = deltaLat;

  const distance = Math.sqrt(x * x + y * y) * radius;
  return distance;
};

//both assume it is sorted by time
export const getTotalDistance = (points: Coords[]): number => {
  return points.reduce((acc, current, index, array) => {
    if (index === 0) return 0;
    const previous = array[index - 1];
    const total = acc + getDistance(previous, current);
    return total;
  }, 0);
};

export const getDuration = (points: Coords[]): number => {
  return (
    (points[points.length - 1].time.getTime() - points[0].time.getTime()) / 1000
  );
};
