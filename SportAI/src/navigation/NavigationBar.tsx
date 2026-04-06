import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import TestScreen1 from '../screens/TestScreen1';
import SQLTest from '../screens/SQLTest';
import HomeScreen from '../screens/Home';
import Settings from '../screens/Settings';
import MapScreen from '../screens/MapScreen';
import { useTheme } from '../theme/ThemeContext';
import AITest from '../screens/AITest';

import sqlIcon from '../../icons/sql.png';
import speechbubbleIcon from '../../icons/speechbubble.png';
import mapIcon from '../../icons/map.png';
import homepageIcon from '../../icons/homepage.png';
import settingsIcon from '../../icons/settings.png';

export type RootTabParamList = {
  Test1: undefined;
  SQLTest: undefined;
  AITest: undefined;
  Map: undefined;
  Home: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function NavigationBar() {
  const { theme, darkMode } = useTheme();
  return (
    <Tab.Navigator
      key={darkMode ? 'dark' : 'light'}
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 0,
          elevation: 0,
        },

        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: darkMode ? '#888' : '#666',

        tabBarLabelStyle: {
          fontSize: 12,
        },

        tabBarIcon: ({ size }) => {
          let icon;

          switch (route.name) {
            case 'SQLTest':
              icon = sqlIcon;
              break;
            case 'AITest':
              icon = speechbubbleIcon;
              break;
            case 'Map':
              icon = mapIcon;
              break;
            case 'Home':
              icon = homepageIcon;
              break;
            case 'Settings':
              icon = settingsIcon;
              break;
            default:
              return null;
          }

          return (
            <Image
              source={icon}
              style={{
                width: size,
                height: size,
                //tintColor: focused ? theme.text : darkMode ? '#888' : '#666',
              }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Test1" component={TestScreen1} />
      <Tab.Screen name="SQLTest" component={SQLTest} />
      <Tab.Screen name="AITest" component={AITest} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
