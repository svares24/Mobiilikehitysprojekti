import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TestScreen1 from '../screens/TestScreen1';
import TestScreen2 from '../screens/TestScreen2';

export type RootTabParamList = {
  Test1: undefined;
  Test2: undefined;
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
    </Tab.Navigator>
  );
}
