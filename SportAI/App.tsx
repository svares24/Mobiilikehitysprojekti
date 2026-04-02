import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import NavigationBar from './src/navigation/NavigationBar';
import { SQLiteProvider } from 'expo-sqlite';
import { createTables } from './src/util/dbHelper';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <SQLiteProvider databaseName="route.db" onInit={createTables}>
        <NavigationContainer>
          <NavigationBar />
        </NavigationContainer>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
