import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, View, Text, TextInput } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../util/firebase';
import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { theme } = useTheme();

  const signUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.inputText}
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={theme.inputText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
            },
          ]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.inputText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.button, borderColor: theme.inputBorder },
          ]}
          onPress={signUp}
        >
          <Text style={{ color: theme.buttonText }}>Sign Up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    width: '22%',
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
  },
});
