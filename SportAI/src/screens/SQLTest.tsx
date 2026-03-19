import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { addRoute, getRoutes, Route } from '../util/dbHelper';
import { SafeAreaView } from 'react-native-safe-area-context';

const SQLTest = () => {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);

  const refreshData = async () => {
    const result = await getRoutes(db);
    setRoutes(result);
  };

  useEffect(() => {
    refreshData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TextInput
          style={{ borderWidth: 1 }}
          value={name}
          onChangeText={setName}
        ></TextInput>
        <Button
          title="Save"
          onPress={async () => {
            await addRoute(db, name);
            await refreshData();
          }}
        ></Button>
        <FlatList
          data={routes}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>
                  {item.route_id} {item.name}
                </Text>
              </View>
            );
          }}
        ></FlatList>
      </View>
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
