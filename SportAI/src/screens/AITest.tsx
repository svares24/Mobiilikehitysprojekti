import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AI from '../util/AI';
import { useState } from 'react';
import { getRoutes } from '../util/dbHelper';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';

const AITest = () => {
  const { theme } = useTheme();
  const [response, setResponse] = useState<string | undefined>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [includeUserData, setIncludeUserData] = useState<boolean>(false);
  const db = useSQLiteContext();

  const generateQuery = async (db: SQLiteDatabase) => {
    const result = await getRoutes(db);
    const data = await AsyncStorage.getItem('userData');
    const query = `Here are my past runs: ${JSON.stringify(
      result
    )} How long should my run be today? Respond only with the length, 0 if I should take a break today. My goal is to improve. Here is some information about me: ${data}`;

    console.log(query);

    return query;
  };

  const askPreset = async () => {
    setResponse('Loading');

    const result = AI.models.generateContent({
      model: 'gemma-3-27b-it',
      contents: await generateQuery(db),
    });

    const final = await result;
    setResponse(final.text);
  };

  const askCustom = async () => {
    setCustomPrompt('');
    if (!customPrompt.trim()) return;

    setResponse('Loading');

    let finalPrompt = customPrompt;

    if (includeUserData) {
      const data = await AsyncStorage.getItem('userData');
      finalPrompt = `${customPrompt}\n\nHere is some information about me: ${data}`;
    }

    console.log(finalPrompt);

    const result = AI.models.generateContent({
      model: 'gemma-3-27b-it',
      contents: finalPrompt,
    });

    const final = await result;
    setResponse(final.text);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.inner}>
        {!useCustom && (
          <>
            <Pressable
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={askPreset}
            >
              <Text style={{ color: theme.buttonText }}>
                Ask (Run Recommendation)
              </Text>
            </Pressable>

            <Pressable onPress={() => setUseCustom(true)}>
              <Text style={{ color: theme.text }}>
                Use custom prompt instead
              </Text>
            </Pressable>
          </>
        )}

        {useCustom && (
          <>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="Enter custom prompt..."
              placeholderTextColor={theme.text}
              value={customPrompt}
              onChangeText={setCustomPrompt}
              multiline
            />

            <Pressable onPress={() => setIncludeUserData(!includeUserData)}>
              <Text style={{ color: theme.text }}>
                {includeUserData
                  ? 'Including your data currently (press to not)'
                  : 'Not including data (press to include)'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={askCustom}
            >
              <Text style={{ color: theme.buttonText }}>
                Ask (Custom Prompt)
              </Text>
            </Pressable>

            <Pressable onPress={() => setUseCustom(false)}>
              <Text style={{ color: theme.text }}>Back to preset</Text>
            </Pressable>
          </>
        )}

        <ScrollView style={styles.responseBox}>
          <Text style={{ color: theme.text }}>{response}</Text>
        </ScrollView>
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
    padding: 16,
  },
  button: {
    padding: 16,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: '100%',
    minHeight: 80,
    borderRadius: 8,
  },
  responseBox: {
    marginTop: 20,
    width: '100%',
    maxHeight: 300,
  },
});

export default AITest;
