import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import NavigationBar from './src/navigation/NavigationBar';
import { ThemeProvider } from './src/theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import FirstTimeScreen from './src/screens/FirstTimeScreen';
import { DatabaseProvider } from './src/context/dbReset';

function AppInner() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const checkLaunch = async () => {
    const val = await AsyncStorage.getItem('hasLaunched');
    setIsFirstLaunch(val === null);
  };

  useEffect(() => {
    checkLaunch();

    const sub = DeviceEventEmitter.addListener('appDataCleared', () => {
      setIsFirstLaunch(true);
    });

    return () => {
      sub.remove();
    };
  }, []);

  if (isFirstLaunch === null) return null;

  if (isFirstLaunch) {
    return (
      <FirstTimeScreen
        onFinish={() => {
          setIsFirstLaunch(false);
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      <NavigationBar />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <AppInner />
      </DatabaseProvider>
    </ThemeProvider>
  );
}
