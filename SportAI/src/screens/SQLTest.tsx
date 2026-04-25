import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import {
  addCompleteRoute,
  backUp,
  changeRouteName,
  deleteRoute,
  getAllPoints,
  getRoutes,
  loadBackUp,
} from '../util/dbHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Point, Route } from '../types';
import { auth } from '../util/firebase';
import { useDbReset } from '../context/dbReset';
import { Directory, Paths } from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

const SQLTest = () => {
  const db = useSQLiteContext();
  const reset = useDbReset();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  const refreshData = async () => {
    const result = await getRoutes(db);
    setRoutes(result);
    const pointResult = await getAllPoints(db);
    setPoints(pointResult);
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <Text>Current user: {auth.currentUser?.email}</Text>
      <Button
        title="Test1"
        onPress={async () => {
          const now = Date.now();
          await addCompleteRoute(db, 'Test1', [
            {
              lat: 65.062781,
              lon: 25.472262,
              alt: 10,
              time: new Date(now - 1000 * 60 * 60 * 24),
            },
            {
              lat: 65.062596,
              lon: 25.496101,
              alt: 10,
              time: new Date(now - 1000 * 60 * 60 * 24 + 60 * 1000 * 5),
            },
            {
              lat: 65.055791,
              lon: 25.472551,
              alt: 10,
              time: new Date(now - 1000 * 60 * 60 * 24 + 60 * 1000 * 10),
            },
            {
              lat: 65.062781,
              lon: 25.472262,
              alt: 10,
              time: new Date(now - 1000 * 60 * 60 * 24 + 60 * 1000 * 15),
            },
          ]);
          refreshData();
        }}
      ></Button>
      <Button
        title="Test2"
        onPress={async () => {
          await addCompleteRoute(db, 'Test2', [
            { lat: 10.05, lon: 10.05, alt: 10, time: new Date(10) },
            { lat: 10.01, lon: 10.01, alt: 10.01, time: new Date(20) },
          ]);
          refreshData();
        }}
      ></Button>
      <Button
        title="Backup"
        onPress={async () => {
          await backUp(db, 'test.db');
        }}
      ></Button>
      <Button
        title="Import"
        onPress={async () => {
          await loadBackUp(db, 'test.db', reset);
        }}
      ></Button>
      <Button
        title="Files"
        onPress={() => {
          console.log(
            new Directory(`${Paths.document.uri}SQLite/`).listAsRecords()
          );
        }}
      ></Button>
      <Text>Routes</Text>
      <FlatList
        data={routes}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>
                {item.route_id} {item.name} {item.distance} {item.duration}{' '}
                {(item.created * 1000).toString()}
              </Text>
              <Button
                title="Delete"
                onPress={async () => {
                  await deleteRoute(db, item.route_id);
                  await refreshData();
                }}
              ></Button>
              <Button
                title="Rename"
                onPress={async () => {
                  await changeRouteName(db, item.route_id, 'New name');
                  await refreshData();
                }}
              ></Button>
            </View>
          );
        }}
      ></FlatList>
      <Text>Points</Text>
      <FlatList
        data={points}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>
                {item.point_id} {item.route_id} {item.lat} {item.lon} {item.alt}{' '}
                {item.time.toString()}
              </Text>
            </View>
          );
        }}
      ></FlatList>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default SQLTest;
