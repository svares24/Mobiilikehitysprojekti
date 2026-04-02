import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AI from '../util/AI';
import { useEffect, useState } from 'react';

const AITest = () => {
  const { theme } = useTheme();
  const [response, setResponse] = useState<string | undefined>('');
  useEffect(() => {}, []);

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
              contents:
                'Generate todays run length considering I ran 1km yesterday. Respond only with the length, 0 if I should take a break today. My goal is to improve',
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
