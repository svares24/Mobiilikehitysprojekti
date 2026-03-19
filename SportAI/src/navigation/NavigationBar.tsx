import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TestScreen1 from '../screens/TestScreen1';
import TestScreen2 from '../screens/TestScreen2';
import SQLTest from '../screens/SQLTest';

export type RootTabParamList = {
  Test1: undefined;
  Test2: undefined;
  SQLTest: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function NavigationBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Test1" component={TestScreen1} />
      <Tab.Screen name="Test2" component={TestScreen2} />
      <Tab.Screen name="SQLTest" component={SQLTest} />
    </Tab.Navigator>
  );
}
