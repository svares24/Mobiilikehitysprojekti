import { useCallback, useState } from 'react';
import { Route } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import Activity from '../components/Activity';
import { getRoutes } from '../util/dbHelper';
import { useSQLiteContext } from 'expo-sqlite';
import { useTheme } from '../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

const Activities = () => {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const [routes, setRoutes] = useState<Route[]>([]);

  const refreshData = async () => {
    const result = await getRoutes(db);
    setRoutes(result);
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
      console.log('refreshed');
    }, [])
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={routes.toReversed()}
        renderItem={({ item }) => <Activity route={item}></Activity>}
      ></FlatList>
    </SafeAreaView>
  );
};

export default Activities;
