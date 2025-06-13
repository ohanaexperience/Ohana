import React, { useState } from 'react';
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

export default function CreateExperienceStep5() {
  const [includedItems, setIncludedItems] = useState({
    food: false,
    drinks: false,
    transport: false,
    equipment: false,
  });

  const [whatToBring, setWhatToBring] = useState('');
  const [physicalActivityLevel, setPhysicalActivityLevel] = useState(null);
  const [ageGroupOpen, setAgeGroupOpen] = useState(false);
  const [ageGroupValue, setAgeGroupValue] = useState(null);
  const [ageGroupOptions, setAgeGroupOptions] = useState([
    { label: 'Kids (6-12)', value: 'kids' },
    { label: 'Teens (13-17)', value: 'teens' },
    { label: 'Adults (18+)', value: 'adults' },
    { label: 'All Ages', value: 'all' },
  ]);
  const [accessibility, setAccessibility] = useState('');

  return (
    <KeyboardAwareScreen>
      <Text style={S.stepText}>Step 5 of 7</Text>
      <View style={S.progressBar}>
        <View style={[S.progressFill, { width: '72%' }]} />
      </View>

      <Text style={S.title}>What's Included</Text>
      <Text style={S.subtitle}>Define what's included and requirements for your experience</Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={S.sectionTitle}>Included Items (Optional)</Text>
          {Object.entries(includedItems).map(([key, value]) => (
            <View key={key} style={styles.checkboxRow}>
              <Checkbox
                value={value}
                onValueChange={(newValue) =>
                  setIncludedItems({ ...includedItems, [key]: newValue })
                }
                style={styles.checkbox}
                color={value ? COLORS.primary : undefined}
              />
              <Text style={styles.checkboxLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={S.sectionTitle}>What to Bring</Text>
          <TextInput
            style={[S.input, { minHeight: 80 }]}
            placeholder="List items guests should bring..."
            placeholderTextColor={COLORS.gray}
            multiline
            value={whatToBring}
            onChangeText={setWhatToBring}
          />
        </View>

        <View style={styles.card}>
          <Text style={S.sectionTitle}>Physical Activity Level</Text>
          {['Low - Minimal physical activity', 'Medium - Moderate activity required', 'High - Intense physical activity'].map((label, idx) => (
            <TouchableOpacity
              key={label}
              style={styles.radioRow}
              onPress={() => setPhysicalActivityLevel(idx)}
            >
              <Ionicons
                name={physicalActivityLevel === idx ? 'radio-button-on' : 'radio-button-off'}
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
            dropDownContainerStyle={{ borderColor: '#ccc', backgroundColor: '#fff', zIndex: 1000 }}
            zIndex={1000}
          />

          <Text style={[S.sectionTitle, { marginTop: 20 }]}>Accessibility Information</Text>
          <TextInput
            style={[S.input, { minHeight: 80 }]}
            placeholder="Describe any accessibility considerations..."
            placeholderTextColor={COLORS.gray}
            multiline
            value={accessibility}
            onChangeText={setAccessibility}
          />
        </View>

        <TouchableOpacity style={[S.button, { marginTop: 24 }]}> 
          <Text style={S.buttonText}>Continue to Step 6</Text>
        </TouchableOpacity>
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