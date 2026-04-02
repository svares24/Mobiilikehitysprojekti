import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeContext';
import { useSQLiteContext } from 'expo-sqlite';
import { DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { Route } from '../types';
import { getRoutes, getRoutesByDate, deleteRoute } from '../util/dbHelper';

type RootTabParamList = {
  Test1: undefined;
  Home: undefined;
};

type HomeScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Home'
>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [routesForDay, setRoutesForDay] = useState<Route[]>([]);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);

  const refreshData = async () => {
    const result = await getRoutes(db);
    setAllRoutes(result);
  };

  useEffect(() => {
    const loadRoutes = async () => {
      const result = await getRoutes(db);
      setAllRoutes(result);
    };
    loadRoutes();
  }, []);

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
      const date = formatDate(r.created);
      marks[date] = { marked: true };
    });
    // :(
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
  /*changed to map the modal instead*/
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
        <Pressable
          /*WIP*/
          style={[styles.button, { backgroundColor: theme.button }]}
          onPress={() => navigation.navigate('Test1')}
        >
          <Text style={{ color: theme.buttonText }}>Start</Text>
        </Pressable>

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
                  <View key={route.route_id}>
                    <Text>
                      {route.name} , {(route.distance / 1000).toFixed(2)} km ,{' '}
                      {Math.round(route.duration / 60)} min
                    </Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
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
});
