import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, View, Text, TextInput } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../util/firebase';
import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Register: undefined;
  SettingsBack: undefined;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('SettingsBack');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.text }}>← Back</Text>
        </Pressable>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
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
            },
          ]}
          placeholder="Password"
          placeholderTextColor={theme.inputText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, { backgroundColor: theme.button }]}
          onPress={login}
        >
          <Text style={{ color: theme.buttonText }}>Login</Text>
        </Pressable>
        <Pressable
          style={[styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ color: theme.buttonText }}>
            No account yet? Register!
          </Text>
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
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  registerButton: {
    alignItems: 'center',
    width: '90%',
    padding: 20,
  },
  button: {
    alignItems: 'center',
    width: '20%',
    padding: 14,
    borderRadius: 10,
  },
  back: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
});
