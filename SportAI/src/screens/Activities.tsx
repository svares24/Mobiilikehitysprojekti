import { useCallback, useState } from 'react';
import { Route } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import Activity from '../components/Activity';
import { getSortedRoutes } from '../util/dbHelper';
import { useSQLiteContext } from 'expo-sqlite';
import { useTheme } from '../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const Activities = () => {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [type, setType] = useState('newest');

  const refreshData = async () => {
    const result = await getSortedRoutes(db, type);
    setRoutes(result);
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
      console.log('refreshed');
    }, [type])
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Picker
        style={{
          color: theme.text,
          backgroundColor: theme.background,
        }}
        mode="dropdown"
        dropdownIconColor={theme.text}
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item
          style={{
            color: theme.text,
            backgroundColor: theme.background,
          }}
          label="Newest"
          value={'newest'}
        ></Picker.Item>
        <Picker.Item
          style={{
            color: theme.text,
            backgroundColor: theme.background,
          }}
          label="Oldest"
          value={'oldest'}
        ></Picker.Item>
        <Picker.Item
          style={{
            color: theme.text,
            backgroundColor: theme.background,
          }}
          label="Longest"
          value={'longest'}
        ></Picker.Item>
        <Picker.Item
          style={{
            color: theme.text,
            backgroundColor: theme.background,
          }}
          label="Shortest"
          value={'shortest'}
        ></Picker.Item>
      </Picker>
      <FlatList
        data={routes.toReversed()}
        renderItem={({ item }) => <Activity route={item}></Activity>}
      ></FlatList>
    </SafeAreaView>
  );
};

export default Activities;
