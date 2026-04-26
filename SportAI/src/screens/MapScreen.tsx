import { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Coords } from '../types/coords';
import { useSQLiteContext } from 'expo-sqlite';
import { addCompleteRoute } from '../util/dbHelper';
import { useTheme } from '../theme/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import PauseIcon from '../../icons/pause.png';
import PlayIcon from '../../icons/play.png';
import { getDistance } from '../util/coordCalculations';

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
      userAgent: 'SportAI/1.0 svares24@students.oamk.fi',
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
  const [prevLocation, setPrevLocation] =
    useState<Location.LocationObject | null>(null);
  const { theme } = useTheme();
  const [locationArray, setLocationArray] = useState<Coords[][]>([[]]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [watchPosition, setWatchPosition] =
    useState<Location.LocationSubscription | null>(null);
  const db = useSQLiteContext();
  const [time, setTime] = useState(0);
  const [isTripActive, setIsTripActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setTime(0);
    console.log('Starting timer');
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTrip = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync(); // permission when using the app
    if (status !== 'granted') return;

    startTimer();
    setIsTripActive(true);

    setWatchPosition(
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5,
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
      )
    );
  };

  const stopTrip = () => {
    watchPosition?.remove();

    webviewRef.current?.injectJavaScript(`
      window.map.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          window.map.removeLayer(layer);
        }
      });
    `);
    setTotalDistance(0);
    setWatchPosition(null);
    stopTimer();
    setIsTripActive(false);
    saveTrip();
  };

  const saveTrip = async () => {
    await addCompleteRoute(db, 'Test', locationArray[0], totalDistance, time);
  };

  useEffect(() => {
    if (location) {
      webviewRef.current?.injectJavaScript(`
        window.map.setView([${location.coords.latitude}, ${location.coords.longitude}], 19);
        circleMarker.setLatLng([${location.coords.latitude}, ${location.coords.longitude}]);
        circleMarker.redraw();
      `);
      if (prevLocation) {
        const polylineCoords = prevLocation
          ? `[[${prevLocation.coords.latitude}, ${prevLocation.coords.longitude}], [${location.coords.latitude}, ${location.coords.longitude}]]`
          : `[[${location.coords.latitude}, ${location.coords.longitude}]]`;
        webviewRef.current?.injectJavaScript(`
         L.polyline(${polylineCoords}, {color: 'blue'}).addTo(window.map);
         `);
        setTotalDistance(
          totalDistance +
            getDistance(
              {
                lat: location.coords.latitude,
                lon: location.coords.longitude,
                alt: location.coords.altitude ?? 0,
                time: new Date(location.timestamp),
              },
              {
                lat: prevLocation.coords.latitude,
                lon: prevLocation.coords.longitude,
                alt: prevLocation.coords.altitude ?? 0,
                time: new Date(prevLocation.timestamp),
              }
            )
        );
      }
      setPrevLocation(location);
    }
  }, [location]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <WebView
        source={{ html }}
        ref={webviewRef}
        style={styles.container}
        javaScriptEnabled
        domStorageEnabled
      />
      <View
        style={[styles.bottomContainer, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.textInput, { color: theme.text }]}>
          {Math.floor(totalDistance)} m
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => (isTripActive ? stopTrip() : startTrip())}
        >
          <Image
            source={isTripActive ? PauseIcon : PlayIcon}
            style={{
              width: 62,
              height: 62,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={[styles.textInput, { color: theme.text }]}>
          {Math.floor(time / 60)
            .toString()
            .padStart(2, '0')}
          :{(time % 60).toString().padStart(2, '0')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
  },
  button: {
    textAlign: 'center',
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    textAlign: 'center',
    width: 120,
    height: 40,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    fontSize: 26,
  },
});
