import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SQLTest from './src/components/SQLTest';
import { SQLiteProvider } from 'expo-sqlite';
import { createTables } from './src/util/db';

export default function App() {
  return (
    <SQLiteProvider databaseName="route.db" onInit={createTables}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
      <SQLTest></SQLTest>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
