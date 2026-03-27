//turhia testi sivuja, voi poistaa kun oikeat sivut on olemassa

import React from 'react';
import { Text, StyleSheet, View, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export default function TestScreen1() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.inner}>
        {/* SCREEN TITLE -> use theme.text */}
        <Text style={[styles.text, { color: theme.text }]}>Test Screen 1</Text>

        {/* BUTTON -> use theme.button + theme.buttonText */}
        <Pressable style={[styles.button, { backgroundColor: theme.button }]}>
          <Text style={{ color: theme.buttonText }}>Button</Text>
        </Pressable>

        {/* INPUT FIELD -> use theme.inputBackground + theme.inputText + theme.inputBorder */}
        <TextInput
          placeholder="Input"
          placeholderTextColor={theme.inputText}
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
            },
          ]}
        />

        {/* CARD / CONTAINER -> use theme.button */}
        <View style={[styles.card, { backgroundColor: theme.button }]}>
          <Text style={{ color: theme.buttonText }}>Card / Container</Text>
        </View>

        {/* SECONDARY TEXT -> use theme.text */}
        <Text style={{ color: theme.text }}>Secondary text example</Text>
      </View>
    </SafeAreaView>
  );
}

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
