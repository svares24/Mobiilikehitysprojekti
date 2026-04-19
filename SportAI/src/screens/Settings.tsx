import { useEffect, useState, useRef } from 'react';
import {
  Text,
  TextInput,
  Switch,
  ScrollView,
  View,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { UserData } from '../types';
import { DeviceEventEmitter } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { backUp, loadBackUp } from '../util/dbHelper';
import { useDbReset } from '../context/dbReset';
import { auth } from '../util/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

type EditableField =
  | 'age'
  | 'height'
  | 'weight'
  | 'fitnessLevel'
  | 'language'
  | 'goal';

const languages = ['American', 'Finnish'];

const goals = [
  'Lose weight',
  'Train for a marathon',
  "Train for Cooper's test",
  'General fitness',
  'Custom',
];

export default function SettingsScreen() {
  const [user, setUser] = useState<UserData>({
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    language: 'English',
    goal: '',
  });

  const { theme, darkMode, toggleDarkMode } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<EditableField | null>(null);

  const inputRef = useRef<TextInput>(null);
  const [isCustomGoal, setIsCustomGoal] = useState(false);

  const db = useSQLiteContext();
  const reset = useDbReset();

  const [email, setEmail] = useState<string | null>(null);

  const confirmBackup = () => {
    Alert.alert('Back up data', 'Are you sure you want to back up your data?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          console.log('backing up data');
          try {
            await backUp(db, 'test.db');
            console.log('Backup success');
            Alert.alert('Success!');
          } catch (error) {
            console.log('Backup error:', error);
            Alert.alert('Error, something went wrong');
          }
        },
      },
    ]);
  };

  const confirmRestore = () => {
    Alert.alert('Restore data', 'Are you sure you want to restore data?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          console.log('restoring data');
          try {
            await loadBackUp(db, 'test.db', reset);
            console.log('Restore success');
            Alert.alert('Success!');
          } catch (error) {
            console.log('Restore error:', error);
            Alert.alert('Error, something went wrong');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsed = JSON.parse(data);

        setUser({
          ...parsed,
          height: parsed.height?.replace(/[^0-9]/g, '') || '',
          weight: parsed.weight?.replace(/[^0-9]/g, '') || '',
        });
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      const formattedUser = {
        ...user,
        height: user.height ? `${user.height} cm` : '',
        weight: user.weight ? `${user.weight} kg` : '',
      };

      await AsyncStorage.setItem('userData', JSON.stringify(formattedUser));
    };

    save();
  }, [user]);

  useEffect(() => {
    if (editingField) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [editingField]);

  const updateAge = (value: string) => {
    setUser((prev) => ({ ...prev, age: value }));
  };

  const updateHeight = (value: string) => {
    setUser((prev) => ({ ...prev, height: value }));
  };

  const updateWeight = (value: string) => {
    setUser((prev) => ({ ...prev, weight: value }));
  };

  const updateFitnessLevel = (value: string) => {
    setUser((prev) => ({ ...prev, fitnessLevel: value }));
  };

  const updateLanguage = (value: string) => {
    setUser((prev) => ({ ...prev, language: value }));
  };

  const updateGoal = (value: string) => {
    setUser((prev) => ({ ...prev, goal: value }));
  };

  const clearData = async () => {
    await AsyncStorage.removeItem('hasLaunched');
    await AsyncStorage.removeItem('userData');

    setUser({
      age: '',
      height: '',
      weight: '',
      fitnessLevel: '',
      language: 'English',
      goal: '',
    });

    DeviceEventEmitter.emit('appDataCleared');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 20,
            color: theme.text,
          }}
        >
          Settings
        </Text>

        <Pressable style={[btn, { backgroundColor: theme.button }]}>
          <Text style={{ color: theme.buttonText }}>
            {email ? `Logged in as: ${email}` : 'Not logged in'}
          </Text>
        </Pressable>

        <Pressable
          style={[btn, { backgroundColor: '#ff4444' }]}
          onPress={handleLogout}
        >
          <Text style={{ color: theme.buttonText }}>Log out</Text>
        </Pressable>

        <Pressable
          style={[btn, { backgroundColor: theme.button }]}
          onPress={() => setEditingField('age')}
        >
          <Text style={{ color: theme.buttonText }}>
            Age: {user.age || '-'}
          </Text>
        </Pressable>

        <Pressable
          style={[btn, { backgroundColor: theme.button }]}
          onPress={() => setEditingField('height')}
        >
          <Text style={{ color: theme.buttonText }}>
            Height: {user.height || '-'} cm
          </Text>
        </Pressable>

        <Pressable
          style={[btn, { backgroundColor: theme.button }]}
          onPress={() => setEditingField('weight')}
        >
          <Text style={{ color: theme.buttonText }}>
            Weight: {user.weight || '-'} kg
          </Text>
        </Pressable>

        <Pressable
          style={[btn, { backgroundColor: theme.button }]}
          onPress={() => setEditingField('fitnessLevel')}
        >
          <Text style={{ color: theme.buttonText }}>
            Fitness Level: {user.fitnessLevel || '-'}
          </Text>
        </Pressable>

        <Pressable
          style={[btn, { backgroundColor: theme.button }]}
          onPress={() => setEditingField('goal')}
        >
          <Text style={{ color: theme.buttonText }}>
            Goal: {user.goal || '-'}
          </Text>
        </Pressable>

        <View style={[btn, row, { backgroundColor: theme.button }]}>
          <Text style={{ color: theme.buttonText }}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>

        <Pressable
          style={[btn, { backgroundColor: theme.button }]}
          onPress={() => setEditingField('language')}
        >
          <Text style={{ color: theme.buttonText }}>
            Language: {user.language}
          </Text>
        </Pressable>

        <View style={backupRow}>
          <Pressable
            style={[btn, halfBtn, { backgroundColor: theme.button }]}
            onPress={confirmBackup}
          >
            <Text style={{ color: theme.buttonText, textAlign: 'center' }}>
              Back Up
            </Text>
          </Pressable>

          <Pressable
            style={[btn, halfBtn, { backgroundColor: theme.button }]}
            onPress={confirmRestore}
          >
            <Text style={{ color: theme.buttonText, textAlign: 'center' }}>
              Restore
            </Text>
          </Pressable>
        </View>

        <Text style={{ marginTop: 20, color: theme.text }}>
          App Version: 1.0.0
        </Text>

        <Pressable onPress={() => setShowPreview(!showPreview)}>
          <Text style={{ marginTop: 20, color: theme.text }}>
            {showPreview ? 'Hide Data' : 'Show Data'}
          </Text>
        </Pressable>

        {showPreview && (
          <>
            <Text style={{ color: theme.text }}>
              {JSON.stringify(user, null, 2)}
            </Text>

            <Pressable
              onPress={clearData}
              style={{
                marginTop: 10,
                padding: 14,
                backgroundColor: '#ff4444',
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: theme.buttonText,
                }}
              >
                Clear Data
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal visible={!!editingField} transparent animationType="fade">
        <View style={overlay}>
          <View style={[modalBox, { backgroundColor: theme.button }]}>
            {(editingField === 'age' ||
              editingField === 'height' ||
              editingField === 'weight') && (
              <TextInput
                ref={inputRef}
                keyboardType="number-pad"
                value={user[editingField]}
                onChangeText={(v) => {
                  const clean = v.replace(/[^0-9]/g, '');

                  if (editingField === 'age') updateAge(clean);
                  if (editingField === 'height') updateHeight(clean);
                  if (editingField === 'weight') updateWeight(clean);
                }}
                style={[
                  input,
                  {
                    backgroundColor: theme.inputBackground,
                    color: theme.inputText,
                    borderColor: theme.inputBorder,
                  },
                ]}
              />
            )}

            {editingField === 'fitnessLevel' && (
              <TextInput
                ref={inputRef}
                value={user.fitnessLevel}
                onChangeText={updateFitnessLevel}
                style={[
                  input,
                  {
                    backgroundColor: theme.inputBackground,
                    color: theme.inputText,
                    borderColor: theme.inputBorder,
                  },
                ]}
              />
            )}

            {editingField === 'goal' && (
              <>
                <FlatList
                  data={goals}
                  keyExtractor={(i) => i}
                  style={{ maxHeight: 200 }}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[btn, { backgroundColor: theme.button }]}
                      onPress={() => {
                        if (item === 'Custom') {
                          setIsCustomGoal(true);
                        } else {
                          setIsCustomGoal(false);
                          updateGoal(item);
                          setEditingField(null);
                        }
                      }}
                    >
                      <Text style={{ color: theme.buttonText }}>{item}</Text>
                    </Pressable>
                  )}
                />

                {isCustomGoal && (
                  <TextInput
                    ref={inputRef}
                    placeholder="Enter custom goal"
                    value={user.goal}
                    onChangeText={updateGoal}
                    style={[
                      input,
                      {
                        backgroundColor: theme.inputBackground,
                        color: theme.inputText,
                        borderColor: theme.inputBorder,
                      },
                    ]}
                  />
                )}
              </>
            )}

            {editingField === 'language' && (
              <FlatList
                data={languages}
                keyExtractor={(i) => i}
                style={{ maxHeight: 200 }}
                renderItem={({ item }) => (
                  <Pressable
                    style={[btn, { backgroundColor: theme.button }]}
                    onPress={() => {
                      updateLanguage(item);
                      setEditingField(null);
                    }}
                  >
                    <Text style={{ color: theme.buttonText }}>{item}</Text>
                  </Pressable>
                )}
              />
            )}

            <Pressable onPress={() => setEditingField(null)}>
              <Text style={{ marginTop: 10, color: theme.text }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const btn = {
  padding: 16,
  marginBottom: 12,
  borderRadius: 10,
};

const row = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const backupRow = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 12,
};

const halfBtn = {
  flex: 1,
  marginBottom: 0,
};

const overlay = {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalBox = {
  width: '80%',
  padding: 20,
  borderRadius: 12,
};

const input = {
  borderWidth: 1,
  padding: 10,
  marginBottom: 10,
};
