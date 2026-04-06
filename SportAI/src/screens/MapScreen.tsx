import { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Coords } from '../types/coords';
import { useSQLiteContext } from 'expo-sqlite';
import { addCompleteRoute } from '../util/dbHelper';

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    window.map = L.map('map').setView([65,25.5], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);
    let circleMarker = L.circleMarker([65,25.5], {radius: 6, color: 'white', fill: true, fillColor: '#0096FF', fillOpacity: 1, weight: 2}).bringToFront().addTo(window.map);
  </script>
</body>
</html>
`;

export default function MapScreen() {
  const webviewRef = useRef<WebView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationArray, setLocationArray] = useState<Coords[][]>([[]]);
  const [totalDistance, setTotalDistance] = useState(0);
  const db = useSQLiteContext();

  const startTrip = () => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5, // distance interval is the minimum distance between updates in meters
        },
        (loc) => {
          setLocation(loc);
          setLocationArray((prev) => [
            [
              ...prev[0],
              {
                lat: loc.coords.latitude,
                lon: loc.coords.longitude,
                alt: loc.coords.altitude ?? 0,
                time: new Date(loc.timestamp),
              },
            ],
          ]);
        }
      );
    })();
  };
  // long press to stop trip
  const stopTrip = () => {
    saveTrip();
  };

  const saveTrip = async () => {
    await addCompleteRoute(db, 'Test', locationArray[0]);
  };

  useEffect(() => {
    if (location) {
      webviewRef.current?.injectJavaScript(`
        window.map.setView([${location.coords.latitude}, ${location.coords.longitude}], 19);
        circleMarker.setLatLng([${location.coords.latitude}, ${location.coords.longitude}]);
        circleMarker.redraw();
        L.polyline(${JSON.stringify(locationArray[0].map((loc) => [loc.lat, loc.lon]))}, {color: 'blue'}).addTo(window.map);
      `);
      setTotalDistance(totalDistance + 5);
      console.log(totalDistance);
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        ref={webviewRef}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
      />
      <TouchableOpacity
        style={styles.button}
        onPress={startTrip}
        onLongPress={stopTrip}
      >
        <Text style={styles.buttonText}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 150,
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 400,
  },
  buttonText: {
    fontSize: 40,
    color: 'white',
  },
});
