import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../theme/ThemeContext';
import { useSQLiteContext } from 'expo-sqlite';
import { DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { Route } from '../types';
import {
  getRoutes,
  getRoutesByDate,
  deleteRoute,
  changeRouteName,
} from '../util/dbHelper';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts/dist/LineChart';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [routesForDay, setRoutesForDay] = useState<Route[]>([]);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');

  const refreshData = async () => {
    const result = await getRoutes(db);
    setAllRoutes(result);
  };

  useFocusEffect(
    useCallback(() => {
      const loadRoutes = async () => {
        const result = await getRoutes(db);
        setAllRoutes(result);
      };
      loadRoutes();
    }, [])
  );

  const formatDate = (timestamp: number) => {
    /* time to yyyy-mm-dd */
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const getMarkedDates = (): MarkedDates => {
    const marks: MarkedDates = {};

    allRoutes.forEach((r) => {
      const date = formatDate(r.created * 1000);
      marks[date] = { marked: true };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
      };
    }
    return marks;
  };

  const handleDayPress = async (day: DateData) => {
    const date = day.dateString;
    setSelectedDate(date);

    const routes = await getRoutesByDate(db, date);
    setRoutesForDay(routes);
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

    const dailyTotals: Record<string, { distance: number; duration: number }> =
      {};

    days.forEach((d) => {
      dailyTotals[key(d)] = { distance: 0, duration: 0 };
    });

    allRoutes.forEach((r) => {
      const d = new Date(r.created * 1000);
      d.setHours(0, 0, 0, 0);
      const k = key(d);

      if (dailyTotals[k] !== undefined) {
        dailyTotals[k].distance += r.distance;
        dailyTotals[k].duration += r.duration;
      }
    });
    const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days.map((d) => {
      const totals = dailyTotals[key(d)];
      const speedKmh =
        totals.duration > 0 ? (totals.distance / totals.duration) * 3.6 : 0;

      return {
        value: Number(speedKmh.toFixed(1)),
        dataPointText: String(speedKmh.toFixed(1)) + ' km/h',
        label: weekdayLabels[d.getDay()],
      };
    });
  }, [allRoutes]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.card, { backgroundColor: theme.button }]}>
        <Calendar
          style={[
            styles.calendar,
            { backgroundColor: theme.calendarBackground },
          ]}
          theme={{
            calendarBackground: theme.calendarBackground,
            monthTextColor: theme.monthTextColor,
            arrowColor: theme.arrowColor,
            dayTextColor: theme.dayTextColor,
            textSectionTitleColor: theme.textSectionTitleColor,
            textInactiveColor: theme.textInactiveColor,
            textDisabledColor: theme.textDisabledColor,
          }}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
        />
        <Modal visible={!!selectedDate}>
          <View
            style={[
              styles.modalOverlay,
              { backgroundColor: theme.modalOverlay },
            ]}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.modalContent },
              ]}
            >
              <Text style={[styles.text, { color: theme.text }]}>
                {selectedDate}
              </Text>
              {routesForDay.length === 0 ? (
                <Text style={{ color: theme.text }}>
                  None
                </Text> /*if no activities*/
              ) : (
                /*else*/
                routesForDay.map((route) => (
                  <View key={route.route_id} style={{ marginBottom: 10 }}>
                    {editingRouteId === route.route_id ? (
                      <>
                        <TextInput
                          placeholderTextColor={theme.inputText}
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.inputBackground,
                              color: theme.inputText,
                              borderColor: theme.inputBorder,
                            },
                          ]}
                          value={newName}
                          onChangeText={setNewName}
                          placeholder="New name"
                        />
                        <Pressable
                          style={[
                            styles.button,
                            { backgroundColor: theme.button },
                          ]}
                          onPress={async () => {
                            if (!newName.trim()) return;

                            await changeRouteName(db, route.route_id, newName);

                            setEditingRouteId(null);
                            setNewName('');

                            await refreshData();
                            const updated = await getRoutesByDate(
                              db,
                              selectedDate!
                            );
                            setRoutesForDay(updated);
                          }}
                        >
                          <Text style={{ color: theme.buttonText }}>Save</Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.button,
                            { backgroundColor: theme.button },
                          ]}
                          onPress={() => setEditingRouteId(null)}
                        >
                          <Text style={{ color: theme.buttonText }}>
                            Cancel
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      <>
                        <Text style={{ color: theme.text }}>
                          {route.name} , {(route.distance / 1000).toFixed(2)}{' '}
                          km, {Math.round(route.duration / 60)} min
                        </Text>

                        <Pressable
                          style={[
                            styles.button,
                            { backgroundColor: theme.button },
                          ]}
                          onPress={() => {
                            setEditingRouteId(route.route_id);
                            setNewName(route.name);
                          }}
                        >
                          <Text style={{ color: theme.buttonText }}>
                            Rename
                          </Text>
                        </Pressable>
                      </>
                    )}

                    <Pressable
                      style={[styles.button, { backgroundColor: theme.button }]}
                      onPress={async () => {
                        await deleteRoute(db, route.route_id);
                        await refreshData();
                        const updated = await getRoutesByDate(
                          db,
                          selectedDate!
                        );
                        setRoutesForDay(updated);
                      }}
                    >
                      <Text style={{ color: theme.buttonText }}>Delete</Text>
                    </Pressable>
                  </View>
                ))
              )}

              <Pressable onPress={() => setSelectedDate(null)}>
                <Text style={styles.closeButton}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View
          style={{
            marginTop: 20,
            borderTopWidth: 1,
            borderColor: theme.inputBorder,
            paddingTop: 20,
            padding: 10,
            flexDirection: 'row',
          }}
        >
          <LineChart
            data={chartData}
            hideYAxisText={true}
            color={theme.text}
            textFontSize1={10}
            thickness={2}
            dataPointsColor={theme.text}
            yAxisColor={theme.text}
            xAxisColor={theme.text}
            xAxisLabelTextStyle={{ color: theme.text }}
            yAxisTextStyle={{ color: theme.text }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 10,
  },
  activityText: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    color: 'red',
  },
  button: {
    marginTop: 20,
    padding: 12,
    alignItems: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 10,
  },
  calendar: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});
