import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Leaflet Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            #map { height: 100vh; width: 100vw; }
            body { margin: 0; padding: 0; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map').setView([60.1699, 24.9384], 13); // Helsinki coordinates as example
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        </script>
    </body>
    </html>
    `;
  
export default class app extends Component {
  render () {
  


    useEffect(() => {
      
    }, [html]);
      // try to inject javascrip to the webview to get polylines (the path taken)
    return (
        <View style={styles.container}>
          <Text>Map Screen</Text>
          <WebView
            style={styles.WebView}
            source={{ html }}
             javaScriptEnabledAndroid={true}
            injectedJavaScript={html}
          />
        </View> 
    );
  }
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: 410,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
  WebView: {
      flex: 1,
  backgroundColor: 'gray'  },
});