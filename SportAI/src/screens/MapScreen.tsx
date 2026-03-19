import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// https://docs.expo.dev/versions/latest/sdk/map-view/

export default function TestScreen2() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});