import { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

type Theme = {
  background: string;
  text: string;
  button: string;
  buttonText: string;
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  tabBar: string;
};

type Props = {
  onFinish: () => void;
};

type FormData = {
  name: string;
  age: string;
  height: string;
  weight: string;
  fitnessLevel: string;
  goal: string;
};

const fitnessOptions = ['Beginner', 'Intermediate', 'Advanced', 'Custom'];

const goalOptions = [
  'Lose weight',
  'Train for a marathon',
  "Train for a Cooper's test",
  'General fitness',
  'Custom',
];

export default function FirstTimeScreen({ onFinish }: Props) {
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const nameRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);
  const customFitnessRef = useRef<TextInput>(null);
  const customGoalRef = useRef<TextInput>(null);

  const [page, setPage] = useState(0);
  const [customFitness, setCustomFitness] = useState(false);
  const [customGoal, setCustomGoal] = useState(false);

  const [data, setData] = useState<FormData>({
    name: '',
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    goal: '',
  });

  const placeholderColor = `${theme.text}99`;

  const update = (key: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const focusPageInput = (index: number) => {
    setTimeout(() => {
      if (index === 1) nameRef.current?.focus();
      if (index === 2) ageRef.current?.focus();
      if (index === 3) heightRef.current?.focus();
      if (index === 4) weightRef.current?.focus();
    }, 320);
  };

  const goTo = (index: number) => {
    Keyboard.dismiss();
    setPage(index);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: index * width, animated: true });
      focusPageInput(index);
    });
  };

  const next = () => goTo(page + 1);
  const back = () => goTo(page - 1);

  const finish = async () => {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    await AsyncStorage.setItem('hasLaunched', 'true');
    onFinish();
  };

  const renderOption = (
    label: string,
    selected: boolean,
    onPress: () => void,
    key: string
  ) => (
    <Pressable
      key={key}
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? theme.button : theme.inputBackground,
          borderColor: selected ? theme.button : theme.inputBorder,
        },
      ]}
    >
      <View style={styles.optionRow}>
        <Text
          style={{
            color: selected ? theme.buttonText : theme.text,
            fontWeight: selected ? '700' : '500',
          }}
        >
          {label}
        </Text>
        {selected && <Text style={{ color: theme.buttonText }}>✓</Text>}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {page > 0 && (
        <Pressable style={styles.back} onPress={back}>
          <Text style={{ color: theme.text }}>← Back</Text>
        </Pressable>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.page}>
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome, please enter your data for a better app experience
            </Text>
            <Pressable
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={next}
            >
              <Text style={{ color: theme.buttonText }}>Continue</Text>
            </Pressable>
          </View>

          <View style={styles.page}>
            <Text style={[styles.title, { color: theme.text }]}>Your name</Text>
            <TextInput
              ref={nameRef}
              style={[styles.input, themedInput(theme)]}
              placeholder="Name"
              placeholderTextColor={placeholderColor}
              value={data.name}
              onChangeText={(v) => update('name', v)}
              returnKeyType="next"
              onSubmitEditing={next}
              blurOnSubmit={false}
            />
            <Pressable
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={next}
            >
              <Text style={{ color: theme.buttonText }}>Next</Text>
            </Pressable>
          </View>

          <View style={styles.page}>
            <Text style={[styles.title, { color: theme.text }]}>Age</Text>
            <TextInput
              ref={ageRef}
              keyboardType="number-pad"
              style={[styles.input, themedInput(theme)]}
              placeholder="Age"
              placeholderTextColor={placeholderColor}
              value={data.age}
              onChangeText={(v) => update('age', v.replace(/[^0-9]/g, ''))}
              returnKeyType="next"
              onSubmitEditing={next}
              blurOnSubmit={false}
            />
            <Pressable
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={next}
            >
              <Text style={{ color: theme.buttonText }}>Next</Text>
            </Pressable>
          </View>

          <View style={styles.page}>
            <Text style={[styles.title, { color: theme.text }]}>Height</Text>
            <TextInput
              ref={heightRef}
              keyboardType="number-pad"
              style={[styles.input, themedInput(theme)]}
              placeholder="Height (cm)"
              placeholderTextColor={placeholderColor}
              value={data.height}
              onChangeText={(v) => update('height', v.replace(/[^0-9]/g, ''))}
              returnKeyType="next"
              onSubmitEditing={next}
              blurOnSubmit={false}
            />
            <Pressable
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={next}
            >
              <Text style={{ color: theme.buttonText }}>Next</Text>
            </Pressable>
          </View>

          <View style={styles.page}>
            <Text style={[styles.title, { color: theme.text }]}>Weight</Text>
            <TextInput
              ref={weightRef}
              keyboardType="number-pad"
              style={[styles.input, themedInput(theme)]}
              placeholder="Weight (kg)"
              placeholderTextColor={placeholderColor}
              value={data.weight}
              onChangeText={(v) => update('weight', v.replace(/[^0-9]/g, ''))}
              returnKeyType="next"
              onSubmitEditing={next}
              blurOnSubmit={false}
            />
            <Pressable
              style={[styles.button, { backgroundColor: theme.button }]}
              onPress={next}
            >
              <Text style={{ color: theme.buttonText }}>Next</Text>
            </Pressable>
          </View>

          <View style={styles.page}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionPageInner}
            >
              <Text style={[styles.title, { color: theme.text }]}>
                Fitness level
              </Text>

              {fitnessOptions.map((option, i) =>
                renderOption(
                  option,
                  option === 'Custom'
                    ? customFitness
                    : !customFitness && data.fitnessLevel === option,
                  () => {
                    if (option === 'Custom') {
                      setCustomFitness(true);
                      update('fitnessLevel', '');
                      setTimeout(() => customFitnessRef.current?.focus(), 100);
                    } else {
                      setCustomFitness(false);
                      update('fitnessLevel', option);
                    }
                  },
                  `fitness-${i}`
                )
              )}

              {customFitness && (
                <TextInput
                  ref={customFitnessRef}
                  style={[styles.input, themedInput(theme)]}
                  placeholder="Custom fitness"
                  placeholderTextColor={placeholderColor}
                  value={data.fitnessLevel}
                  onChangeText={(v) => update('fitnessLevel', v)}
                />
              )}

              <Pressable
                style={[styles.button, { backgroundColor: theme.button }]}
                onPress={next}
              >
                <Text style={{ color: theme.buttonText }}>Next</Text>
              </Pressable>
            </ScrollView>
          </View>

          <View style={styles.page}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionPageInner}
            >
              <Text style={[styles.title, { color: theme.text }]}>Goal</Text>

              {goalOptions.map((option, i) =>
                renderOption(
                  option,
                  option === 'Custom'
                    ? customGoal
                    : !customGoal && data.goal === option,
                  () => {
                    if (option === 'Custom') {
                      setCustomGoal(true);
                      update('goal', '');
                      setTimeout(() => customGoalRef.current?.focus(), 100);
                    } else {
                      setCustomGoal(false);
                      update('goal', option);
                    }
                  },
                  `goal-${i}`
                )
              )}

              {customGoal && (
                <TextInput
                  ref={customGoalRef}
                  style={[styles.input, themedInput(theme)]}
                  placeholder="Custom goal"
                  placeholderTextColor={placeholderColor}
                  value={data.goal}
                  onChangeText={(v) => update('goal', v)}
                />
              )}

              <Pressable
                style={[styles.button, { backgroundColor: theme.button }]}
                onPress={finish}
              >
                <Text style={{ color: theme.buttonText }}>Finish</Text>
              </Pressable>
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const themedInput = (theme: Theme) => ({
  backgroundColor: theme.inputBackground,
  color: theme.inputText,
  borderColor: theme.inputBorder,
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  page: {
    width,
    padding: 24,
    justifyContent: 'center',
  },
  optionPageInner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  option: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
});
