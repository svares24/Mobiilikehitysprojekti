import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  TextInput,
  Switch,
  ScrollView,
  View,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserData = {
  age: string;
  height: string;
  weight: string;
  fitnessLevel: string;
  language: string;
};

type EditableField = 'age' | 'height' | 'weight' | 'fitnessLevel' | 'language';

// miksi tässä edes on kieliä?
const languages = [
  'English',
  'American',
  'Australian',
  'British',
  'Hindi',
  'Finnish',
  'French',
  'Spanish',
  'Catalan',
  'Swedish',
  'Icelandic',
  'Norwegian',
  'Danish',
  'Albanian',
  'Serbian',
  'Bulgarian',
  'Faroese',
  'Estonian',
  'Latvian',
  'Lithuanian',
  'Korean',
];

export default function SettingsScreen() {
  const [user, setUser] = useState<UserData>({
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    language: 'English',
  });

  const [darkMode, setDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<EditableField | null>(null);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUser(JSON.parse(data));
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('userData', JSON.stringify(user));
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

  const clearData = async () => {
    await AsyncStorage.removeItem('userData');
    setUser({
      age: '',
      height: '',
      weight: '',
      fitnessLevel: '',
      language: 'English',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>
          Settings
        </Text>

        <Pressable style={btn} onPress={() => setEditingField('age')}>
          <Text>Age: {user.age || '-'}</Text>
        </Pressable>

        <Pressable style={btn} onPress={() => setEditingField('height')}>
          <Text>Height: {user.height || '-'} cm</Text>
        </Pressable>

        <Pressable style={btn} onPress={() => setEditingField('weight')}>
          <Text>Weight: {user.weight || '-'} kg</Text>
        </Pressable>

        <Pressable style={btn} onPress={() => setEditingField('fitnessLevel')}>
          <Text>Fitness Level: {user.fitnessLevel || '-'}</Text>
        </Pressable>

        <View style={[btn, row]}>
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <Pressable style={btn} onPress={() => setEditingField('language')}>
          <Text>Language: {user.language}</Text>
        </Pressable>

        <Text style={{ marginTop: 20 }}>App Version: 1.0.0</Text>

        <Pressable onPress={() => setShowPreview(!showPreview)}>
          <Text style={{ marginTop: 20 }}>
            {showPreview ? 'Hide Data' : 'Show Data'}
          </Text>
        </Pressable>

        {showPreview && (
          <>
            <Text>{JSON.stringify(user, null, 2)}</Text>

            <Pressable
              onPress={clearData}
              style={{
                marginTop: 10,
                padding: 14,
                backgroundColor: '#ff4444',
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>
                Clear Data
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal visible={!!editingField} transparent animationType="fade">
        <View style={overlay}>
          <View style={modalBox}>
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
                style={input}
              />
            )}

            {editingField === 'fitnessLevel' && (
              <TextInput
                ref={inputRef}
                value={user.fitnessLevel}
                onChangeText={updateFitnessLevel}
                style={input}
              />
            )}

            {editingField === 'language' && (
              <FlatList
                data={languages}
                keyExtractor={(i) => i}
                style={{ maxHeight: 200 }}
                renderItem={({ item }) => (
                  <Pressable
                    style={btn}
                    onPress={() => {
                      updateLanguage(item);
                      setEditingField(null);
                    }}
                  >
                    <Text>{item}</Text>
                  </Pressable>
                )}
              />
            )}

            <Pressable onPress={() => setEditingField(null)}>
              <Text style={{ marginTop: 10 }}>Close</Text>
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
  backgroundColor: '#eee',
  borderRadius: 10,
};

const row = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const overlay = {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalBox = {
  width: '80%',
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 12,
};

const input = {
  borderWidth: 1,
  padding: 10,
  marginBottom: 10,
};
