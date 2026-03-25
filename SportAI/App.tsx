import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import NavigationBar from './src/navigation/NavigationBar';

export default function App() {
  return (
    <View style={styles.container}>
        <NavigationContainer>
        <NavigationBar />
      </NavigationContainer> 
      </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map :{
    width: '100%',
    height: '100%',
  }
});
