import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TestScreen1 from '../screens/TestScreen1';
import TestScreen2 from '../screens/TestScreen2';
import SQLTest from '../screens/SQLTest';
import HomeScreen from '../screens/Home';
import Settings from '../screens/Settings';

import { useTheme } from '../theme/ThemeContext';

export type RootTabParamList = {
  Test1: undefined;
  Test2: undefined;
  SQLTest: undefined;
  Home: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function NavigationBar() {
  const { theme, darkMode } = useTheme();
  return (
    <Tab.Navigator
      key={darkMode ? 'dark' : 'light'}
      screenOptions={{
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
      }}
    >
      <Tab.Screen name="Test1" component={TestScreen1} />
      <Tab.Screen name="Test2" component={TestScreen2} />
      <Tab.Screen name="SQLTest" component={SQLTest} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
