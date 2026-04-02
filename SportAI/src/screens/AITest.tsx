import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AI from '../util/AI';
import { useState } from 'react';
import { getRoutes } from '../util/dbHelper';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';

const AITest = () => {
  const { theme } = useTheme();
  const [response, setResponse] = useState<string | undefined>('');
  const db = useSQLiteContext();

  const generateQuery = async (db: SQLiteDatabase) => {
    const result = await getRoutes(db);
    const data = await AsyncStorage.getItem('userData');
    const query = `Here are my past runs: ${JSON.stringify(result)} How long should my run be today? Respond only with the length, 0 if I should take a break today. My goal is to improve. Here is some information about me: ${data}`;
    console.log(query);
    return query;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.inner}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.button }]}
          onPress={async () => {
            const result = AI.models.generateContent({
              model: 'gemma-3-27b-it',
              contents: await generateQuery(db),
            });
            setResponse('Loading');
            const final = await result;
            setResponse(final.text);
          }}
        >
          <Text style={{ color: theme.buttonText }}>Ask</Text>
        </Pressable>

        <Text style={{ color: theme.text }}>{response}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 24,
  },
  button: {
    padding: 16,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  card: {
    padding: 20,
    borderRadius: 10,
  },
});

export default AITest;
