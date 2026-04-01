import React, { useEffect, useState, useRef} from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

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
    window.map = L.map('map').setView([60.1699, 24.9384], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);
  </script>
</body>
</html>
`;



export default function MapScreen() {

  const webviewRef = useRef<WebView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => setLocation(loc)
      );
    })();
  }, []);

  setTimeout(() => {
      webviewRef.current?.injectJavaScript(`
        window.map.setView([${location?.coords.latitude}, ${location?.coords.longitude}], 15);
        L.marker([${location?.coords.latitude}, ${location?.coords.longitude}]).addTo(map).bindPopup([${location?.coords.latitude}, ${location?.coords.longitude}].toString()).openPopup();
      `);
    }, 3000);
  

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        ref={webviewRef}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
      />
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
});