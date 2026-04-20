import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Route } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useState } from 'react';
import ActivityMap from './ActivityMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActivityStats from './ActivityStats';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    margin: 10,
    padding: 15,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  values: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  keys: {
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    lineHeight: 20,
  },
});

const Activity = ({ route }: { route: Route }) => {
  const { theme } = useTheme();
  const [mapVisible, setMapVisible] = useState(false);

  return (
    <View>
      <Pressable onPress={() => setMapVisible(true)}>
        <ActivityStats route={route}></ActivityStats>
      </Pressable>

      <Modal
        visible={mapVisible}
        animationType="slide"
        onRequestClose={() => setMapVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={[
                styles.closeButton,
                { backgroundColor: theme.calendarBackground, flex: 1 },
              ]}
              onPress={() => setMapVisible(false)}
              hitSlop={8}
            >
              <Text style={[styles.closeButtonText, { color: theme.text }]}>
                ×
              </Text>
            </Pressable>
          </View>
          <ActivityStats route={route}></ActivityStats>
          <ActivityMap id={route.route_id}></ActivityMap>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default Activity;
