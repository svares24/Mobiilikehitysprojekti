import React, { useState, useEffect } from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from "react-native-calendars"; 
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
//import { useTheme } from '../theme/ThemeContext';
import { useSQLiteContext } from "expo-sqlite";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { Route } from "../types";
import { getRoutes, getRoutesByDate } from "../util/dbHelper";

type RootTabParamList = {
  Test1: undefined;
  Home: undefined;
};

type HomeScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  "Home"
>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const db = useSQLiteContext();
  //const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [routesForDay, setRoutesForDay] = useState<Route[]>([]);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const loadRoutes = async () => {
      const result = await getRoutes(db);
      setAllRoutes(result);
    };
    loadRoutes();
  }, []);

  const formatDate = (timestamp: number) => { /*time to yyyy-mm-dd*/
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

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

  const getActivityText = () => {
    if (!routesForDay.length) return "None";

    return routesForDay
      .map(
        (r) =>
          `${r.name} , ${(r.distance / 1000).toFixed(2)} km , ${Math.round(
            r.duration / 60
          )} min`
      )
      .join("\n");
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
        />
        <Pressable
        /*WIP*/
          style={styles.Button}
          onPress={() => navigation.navigate("Test1")}>
          <Text style={styles.ButtonText}>Start</Text>
        </Pressable>

        <Modal visible={!!selectedDate}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{selectedDate}</Text>

              <Text style={styles.activityText}>
                {getActivityText()}
              </Text>

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
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  title: {
    fontSize: 10,
  },
  activityText: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "red",
  },
  Button: {
    marginTop: 20,
    padding: 12,
    alignItems: "center",
  },
  ButtonText: {
    color: "green",
    fontSize: 16,
  },
});