import { StyleSheet, View } from 'react-native';
import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
} from '@maplibre/maplibre-react-native';
import { useEffect, useState } from 'react';
import { getBounds, getPoints } from '../util/dbHelper';
import { useSQLiteContext } from 'expo-sqlite';

const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const ActivityMap = ({ id }: { id: number }) => {
  const db = useSQLiteContext();
  const [bounds, setBounds] = useState<number[]>([]);
  const [route, setRoute] = useState<GeoJSON.Feature | null>();

  const loadData = async () => {
    const boundResult = await getBounds(db, id);
    setBounds(boundResult);
    const points = await getPoints(db, id);
    setRoute({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: points.map((p) => [p.lon, p.lat]),
      },
    });
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <View style={styles.container}>
      {route && (
        <MapView style={styles.map} mapStyle={MAP_STYLE}>
          <Camera
            animationDuration={0}
            bounds={{
              ne: [bounds[1], bounds[0]],
              sw: [bounds[3], bounds[2]],
              paddingTop: 40,
              paddingBottom: 40,
              paddingLeft: 40,
              paddingRight: 40,
            }}
          />
          <ShapeSource id="routeSource" shape={route}>
            <LineLayer
              id="routeLine"
              style={{
                lineColor: '#ff0000',
                lineWidth: 3,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </ShapeSource>
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default ActivityMap;
