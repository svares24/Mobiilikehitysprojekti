import React, { useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from "react-native-calendars"; //periaatteessa big-calendar käy myös, tai käyttämällä gridejä.
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type RootTabParamList = {
  Test1: undefined;
  Home: undefined;
};
//navigointi eri sivulle ja automaattinen treenin aloittaminen
//test1 on väliaikaisesti käytössä
type HomeScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  "Home"
>;
type Props = {
  navigation: HomeScreenNavigationProp;
};
type ActivityMap = {
    [key: string]: string;
};
const activities: ActivityMap = {
    "2026-03-17": "5km, jep", //pvm + treeni. Myöhemmin vaikka tiedon siirtäminen tietokannasta tähän.
};

export default function HomeScreen({ navigation }: Props) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const getActivityText = () => {
        if (selectedDate && activities[selectedDate]) {
            return activities[selectedDate];
        } else {
            return "None";
        }};

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          "2026-03-17": { marked: true }, //Päivämäärä on muotoa yyyy/mm/dd ja marked näyttää kalenterissa merkin päivämäärän kohdalla.
        }}/>
      
      <Pressable
        style={styles.Button}
         onPress={() => navigation.navigate("Test1")}>
        <Text style={styles.ButtonText}>Start</Text>
      </Pressable>

      <Modal visible={!!selectedDate}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {selectedDate}
            </Text>
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