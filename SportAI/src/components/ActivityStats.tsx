import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Route } from '../types';

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

const ActivityStats = ({ route }: { route: Route }) => {
  const { theme } = useTheme();

  const formatDistance = (distance: number): string => {
    return `${Math.round(distance / 10) / 100}km`;
  };

  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if (hours > 0) {
      return `${hours}:${minutes}'${seconds}`;
    }

    return `${minutes}'${seconds}`;
  };

  const formatSpeed = (speed: number): string => {
    return `${Math.round(speed * 3.6 * 10) / 10}km/h`;
  };
  return (
    <View style={[styles.item, { backgroundColor: theme.calendarBackground }]}>
      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.title, { color: theme.text }]}>{route.name}</Text>
        <Text style={[styles.keys, { color: theme.text }]}>
          {new Date(route.created).toLocaleString('fi-FI')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.keys, { color: theme.text }]}>Matka</Text>
          <Text style={[styles.values, { color: theme.text }]}>
            {formatDistance(route.distance)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.keys, { color: theme.text }]}>Kesto</Text>
          <Text style={[styles.values, { color: theme.text }]}>
            {formatDuration(route.duration)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.keys, { color: theme.text }]}>Keskinopeus</Text>
          <Text style={[styles.values, { color: theme.text }]}>
            {formatSpeed(route.distance / route.duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityStats;
