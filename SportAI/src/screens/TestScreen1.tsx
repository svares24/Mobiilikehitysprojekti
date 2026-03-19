//turhia testi sivuja, voi poistaa kun oikeat sivut on olemassa

import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestScreen1() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Test Screen 1</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
