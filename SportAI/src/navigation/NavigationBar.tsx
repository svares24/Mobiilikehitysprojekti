import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import HomeScreen from '../screens/Home';
import Settings from '../screens/Settings';
import MapScreen from '../screens/MapScreen';
import { useTheme } from '../theme/ThemeContext';
import mapIcon from '../../icons/map.png';
import homepageIcon from '../../icons/homepage.png';
import settingsIcon from '../../icons/settings.png';
import activitiesIcon from '../../icons/column-chart.png';
import speechbubbleIcon from '../../icons/speechbubble.png';
import Activities from '../screens/Activities';
import Login from '../screens/Login';
import Register from '../screens/Register';
import AITest from '../screens/AITest';

export type RootTabParamList = {
  Login: undefined;
  Map: undefined;
  Home: undefined;
  Activities: undefined;
  Settings: undefined;
  SettingsBack: undefined;
  Register: undefined;
  AITest: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const SettingsTab = createStackNavigator<RootTabParamList>();

function SettingsTabs() {
  return (
    <SettingsTab.Navigator screenOptions={{ headerShown: false }}>
      <SettingsTab.Screen name="SettingsBack" component={Settings} />
      <SettingsTab.Screen name="Login" component={Login} />
      <SettingsTab.Screen name="Register" component={Register} />
    </SettingsTab.Navigator>
  );
}

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
            case 'Map':
              icon = mapIcon;
              break;
            case 'Home':
              icon = homepageIcon;
              break;
            case 'Settings':
              icon = settingsIcon;
              break;
            case 'Activities':
              icon = activitiesIcon;
              break;
            case 'AITest':
              icon = speechbubbleIcon;
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Activities" component={Activities} />
      <Tab.Screen name="Settings" component={SettingsTabs} />
      <Tab.Screen name="AITest" component={AITest} />
    </Tab.Navigator>
  );
}
