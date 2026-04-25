import { useCallback, useState, useMemo } from 'react';
import { Route } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, View, Text, Pressable } from 'react-native';
import Activity from '../components/Activity';
import { getSortedRoutes } from '../util/dbHelper';
import { useSQLiteContext } from 'expo-sqlite';
import { useTheme } from '../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-gifted-charts';

const Activities = () => {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [type, setType] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

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

  const chartData = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }

    const key = (d: Date) =>
      `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

    const counts: Record<string, number> = {};

    days.forEach((d) => {
      counts[key(d)] = 0;
    });

    routes.forEach((r) => {
      const d = new Date(r.created);
      d.setHours(0, 0, 0, 0);
      const k = key(d);

      if (counts[k] !== undefined) {
        counts[k] += 1;
      }
    });

    return days.map((d) => ({
      value: counts[key(d)],
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      frontColor: theme.text,
    }));
  }, [routes, theme.text]);
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
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Pressable
          onPress={() => setViewMode('list')}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor:
              viewMode === 'list' ? theme.text : theme.background,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: viewMode === 'list' ? theme.background : theme.text,
            }}
          >
            List
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setViewMode('chart')}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor:
              viewMode === 'chart' ? theme.text : theme.background,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: viewMode === 'chart' ? theme.background : theme.text,
            }}
          >
            Chart
          </Text>
        </Pressable>
      </View>
      {viewMode === 'list' ? (
        <FlatList
          data={routes.toReversed()}
          renderItem={({ item }) => <Activity route={item} />}
        />
      ) : (
        <View style={{ padding: 10 }}>
          <BarChart
            data={chartData}
            barWidth={24}
            spacing={20}
            roundedTop
            xAxisColor={theme.text}
            yAxisColor={theme.text}
            xAxisLabelTextStyle={{ color: theme.text }}
            yAxisTextStyle={{ color: theme.text }}
            noOfSections={5}
            maxValue={Math.max(...chartData.map((d) => d.value)) > 5 ? 10 : 5}
            stepValue={Math.max(...chartData.map((d) => d.value)) > 5 ? 2 : 1}
            formatYLabel={(value) => String(parseInt(value))}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Activities;
