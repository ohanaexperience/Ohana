import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { COMMON_STYLES as S, COLORS } from '../../constants/theme';
import { useExperienceStore } from '../store/experience';
import { useRouter, useNavigation } from 'expo-router';

export default function CreateExperienceStep5() {
       const router = useRouter();
        const navigation = useNavigation();
  const { step5, setStep5 } = useExperienceStore();

  const [includedItems, setIncludedItems] = useState<string[]>(step5.includedItems);
  const [thingsToBring, setThingsToBring] = useState(step5.thingsToBring);
  const [activityLevel, setActivityLevel] = useState(step5.activityLevel);
  const [accessibilityNotes, setAccessibilityNotes] = useState(step5.accessibilityNotes);

  const [ageGroupOpen, setAgeGroupOpen] = useState(false);
  const [ageGroupValue, setAgeGroupValue] = useState(step5.recommendedAge);
  const [ageGroupOptions, setAgeGroupOptions] = useState([
  { label: '18–25', value: '18-25' },
  { label: '26–35', value: '26-35' },
  { label: '36–45', value: '36-45' },
  { label: '46–55', value: '46-55' },
  { label: '56–65', value: '56-65' },
  { label: '66+', value: '66+' },
]);

  const [error, setError] = useState('');

const handleContinue = () => {
  if (!step5.activityLevel) {
    setError('Please select a physical activity level.');
    return;
  }

  if (!step5.recommendedAge) {
    setError('Please select a recommended age group.');
    return;
  }

  if (!step5.accessibilityNotes.trim()) {
    setError('Please enter accessibility information.');
    return;
  }

  setError('');
  router.push('./step6');
};

  const toggleIncluded = (item: string) => {
    setIncludedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  useEffect(() => {
    setStep5({
      includedItems,
      thingsToBring,
      activityLevel,
      recommendedAge: ageGroupValue,
      accessibilityNotes,
    });
  }, [includedItems, thingsToBring, activityLevel, ageGroupValue, accessibilityNotes]);

  useLayoutEffect(() => {
          navigation.setOptions({
            title: 'Create Experience',
            headerTitleAlign: 'center',
          });
        }, [navigation]);
console.log('Step 5 data:', step5);
  return (
    <KeyboardAwareScreen>
      <Text style={S.stepText}>Step 5 of 7</Text>
      <View style={S.progressBar}>
        <View style={[S.progressFill, { width: '72%' }]} />
      </View>

      <Text style={S.title}>What's Included</Text>
      <Text style={S.subtitle}>
        Define what's included and requirements for your experience
      </Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={S.sectionTitle}>Included Items (Optional)</Text>
          {['food', 'drinks', 'transport', 'equipment'].map((item) => (
            <View key={item} style={styles.checkboxRow}>
              <Checkbox
                value={includedItems.includes(item)}
                onValueChange={() => toggleIncluded(item)}
                style={styles.checkbox}
                color={includedItems.includes(item) ? COLORS.primary : undefined}
              />
              <Text style={styles.checkboxLabel}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={S.sectionTitle}>What to Bring</Text>
          <TextInput
            style={[S.input, { minHeight: 80 }]}
            placeholder="List items guests should bring..."
            placeholderTextColor={COLORS.placeholder}
            multiline
            value={thingsToBring}
            onChangeText={setThingsToBring}
          />
        </View>

        <View style={styles.card}>
          <Text style={S.sectionTitle}>Physical Activity Level</Text>
          {[
            { label: 'Low - Minimal physical activity', value: 'low' },
            { label: 'Medium - Moderate activity required', value: 'medium' },
            { label: 'High - Intense physical activity', value: 'high' },
          ].map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={styles.radioRow}
              onPress={() => setActivityLevel(value)}
            >
              <Ionicons
                name={activityLevel === value ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={COLORS.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={S.sectionTitle}>Recommended Age Groups</Text>
          <DropDownPicker
            open={ageGroupOpen}
            value={ageGroupValue}
            items={ageGroupOptions}
            setOpen={setAgeGroupOpen}
            setValue={setAgeGroupValue}
            setItems={setAgeGroupOptions}
            placeholder="Select age range"
            
            style={dropdownStyle}
            dropDownContainerStyle={{
              borderColor: '#ccc',
              backgroundColor: '#fff',
              zIndex: 1000,
            }}
            zIndex={1000}
          />

          <Text style={[S.sectionTitle, { marginTop: 20 }]}>Accessibility Information</Text>
          <TextInput
            style={[S.input, { minHeight: 80 }]}
            placeholder="Describe any accessibility considerations..."
            placeholderTextColor={COLORS.placeholder}
            multiline
            value={accessibilityNotes}
            onChangeText={setAccessibilityNotes}
          />
        </View>

        <TouchableOpacity style={[S.button, { marginTop: 24 }]} onPress={handleContinue}>
          <Text style={S.buttonText}>Continue to Step 6</Text>
        </TouchableOpacity>

        {error ? (
        <Text style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
  },
});

const dropdownStyle = {
  borderColor: '#ccc',
  borderRadius: 6,
  backgroundColor: '#fff',
};