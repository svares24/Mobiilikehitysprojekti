import { useCallback, useState, useMemo } from 'react';
import { Compound, PeriodFormat, PeriodName, Route } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, View, Text, Pressable } from 'react-native';
import Activity from '../components/Activity';
import { getSortedRoutes, getSumRoute } from '../util/dbHelper';
import { useSQLiteContext } from 'expo-sqlite';
import { useTheme } from '../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';
import { format } from 'date-fns';

const periodMap: Record<PeriodName, PeriodFormat> = {
  year: 'yyyy',
  month: 'MMM',
  day: 'd',
  hour: 'H',
};

const periodDBMap: Record<PeriodName, PeriodFormat> = {
  year: 'y',
  month: 'y-MM',
  day: 'y-MM-dd',
  hour: "yyyy-MM-dd'T'HH:00:00",
};

const Activities = () => {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [type, setType] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [data, setData] = useState<Compound[]>([]);
  const [period, setPeriod] = useState<PeriodName>('day');

  const refreshData = async () => {
    const result = await getSortedRoutes(db, type);
    const newData = await getSumRoute(db, period);
    setData(newData);
    setRoutes(result);
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [type, period])
  );

  const getLine = (raw: Compound[], type: PeriodName): lineDataItem[] => {
    if (!raw.length) return [];
    const data = raw.reduce<Record<string, number>>((acc, r) => {
      acc[r.period] = r.distance;
      return acc;
    }, {});
    //const startDate = new Date(raw[0].period);
    const values: number[] = [];
    const endDate = new Date(raw[raw.length - 1].period);
    const result: lineDataItem[] = [];
    const current = new Date(endDate);
    while (result.length < 7) {
      const dataStr = format(current, periodDBMap[type]);
      values.push(data[dataStr] ?? 0);
      result.push({
        value: (data[dataStr] ?? 0) / 1000,
        label: format(current, periodMap[type]),
      });
      switch (type) {
        case 'hour':
          current.setHours(current.getHours() - 1);
          break;
        case 'day':
          current.setDate(current.getDate() - 1);
          break;
        case 'month':
          current.setMonth(current.getMonth() - 1);
          break;
        case 'year':
          current.setFullYear(current.getFullYear() - 1);
          break;
      }
    }
    return result.toReversed();
  };

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
      const d = new Date(r.created * 1000);
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
        <>
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
            renderItem={({ item }) => <Activity route={item} />}
          />
        </>
      ) : (
        <View style={{ padding: 10 }}>
          <BarChart
            data={chartData}
            barWidth={24}
            spacing={20}
            roundedTop
            yAxisLabelWidth={45}
            yAxisLabelSuffix=" trips"
            xAxisColor={theme.text}
            yAxisColor={theme.text}
            xAxisLabelTextStyle={{ color: theme.text }}
            yAxisTextStyle={{ color: theme.text }}
            noOfSections={5}
            maxValue={Math.max(...chartData.map((d) => d.value)) > 5 ? 10 : 5}
            stepValue={Math.max(...chartData.map((d) => d.value)) > 5 ? 2 : 1}
            formatYLabel={(value) => String(parseInt(value))}
          />
          <Picker
            style={{
              color: theme.text,
              backgroundColor: theme.background,
            }}
            mode="dropdown"
            dropdownIconColor={theme.text}
            selectedValue={type}
            onValueChange={(itemValue) => setPeriod(itemValue as PeriodName)}
          >
            <Picker.Item
              style={{
                color: theme.text,
                backgroundColor: theme.background,
              }}
              label="Day"
              value={'day'}
            ></Picker.Item>
            <Picker.Item
              style={{
                color: theme.text,
                backgroundColor: theme.background,
              }}
              label="Month"
              value={'month'}
            ></Picker.Item>
            <Picker.Item
              style={{
                color: theme.text,
                backgroundColor: theme.background,
              }}
              label="Year"
              value={'year'}
            ></Picker.Item>
          </Picker>
          <LineChart
            data={getLine(data, period)}
            color={theme.text}
            dataPointsColor={theme.text}
            yAxisLabelWidth={45}
            yAxisLabelSuffix="km"
            yAxisColor={theme.text}
            xAxisColor={theme.text}
            xAxisLabelTextStyle={{ color: theme.text }}
            yAxisTextStyle={{ color: theme.text }}
          ></LineChart>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Activities;
