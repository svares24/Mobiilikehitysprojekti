import React from 'react';
import { StyleSheet, View } from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// https://docs.expo.dev/versions/latest/sdk/map-view/

export default function MapScreen() {
  return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
        >
          <Marker 
     coordinate= {
              {
                latitude: 37.78825,
                longitude: -122.4324,
              }
            }
            title={"Marker Title"}
            description={"Marker Description"}
            />
      </MapView>
      </View> 
  );
}

const styles = StyleSheet.create({
   container: {
   position: 'absolute',
   top: 0,
   left: 0,
   right: 0,
   bottom: 0,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});