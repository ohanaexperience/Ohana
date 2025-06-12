import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';

export default function CreateExperienceStep3() {
  const [basePrice, setBasePrice] = useState('');

  const [groupRatesEnabled, setGroupRatesEnabled] = useState(false);
  const [group3Open, setGroup3Open] = useState(false);
  const [group3Value, setGroup3Value] = useState(null);
  const [group3Items, setGroup3Items] = useState([
    { label: '5% discount', value: '5' },
    { label: '10% discount', value: '10' },
    { label: '15% discount', value: '15' },
  ]);

  const [group5Open, setGroup5Open] = useState(false);
  const [group5Value, setGroup5Value] = useState(null);
  const [group5Items, setGroup5Items] = useState([
    { label: '10% discount', value: '10' },
    { label: '15% discount', value: '15' },
    { label: '20% discount', value: '20' },
  ]);

  const [earlyBirdEnabled, setEarlyBirdEnabled] = useState(false);

  const [cancellationOpen, setCancellationOpen] = useState(false);
  const [cancellationValue, setCancellationValue] = useState(null);
  const [cancellationOptions, setCancellationOptions] = useState([
    { label: 'Flexible (Full refund 24h prior)', value: 'flexible' },
    { label: 'Moderate (50% refund 24h prior)', value: 'moderate' },
    { label: 'Strict (No refund)', value: 'strict' },
  ]);

  const [minGuests, setMinGuests] = useState('1');
  const [maxGuests, setMaxGuests] = useState('10');
  const [autoCancel, setAutoCancel] = useState(false);

  return (
    <KeyboardAwareScreen>
      <Text style={styles.stepText}>Step 3 of 7</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '42%' }]} />
      </View>

      <Text style={styles.title}>Set Pricing & Group Size</Text>
      <Text style={styles.subtitle}>Set your experience pricing and capacity limits</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Base Price</Text>
        <Text style={styles.label}>Price per Person</Text>
        <TextInput
          style={styles.input}
          value={basePrice}
          onChangeText={setBasePrice}
          placeholder="$ 0.00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Group Discounts</Text>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Enable Group Rates</Text>
          <Switch value={groupRatesEnabled} onValueChange={setGroupRatesEnabled} />
        </View>
        {groupRatesEnabled && (
          <>
            <Text style={styles.label}>For groups of 3+</Text>
            <DropDownPicker
              open={group3Open}
              value={group3Value}
              items={group3Items}
              setOpen={setGroup3Open}
              setValue={setGroup3Value}
              setItems={setGroup3Items}
              placeholder="5% discount"
              style={styles.dropdown}
              containerStyle={{ marginBottom: 16 }}
              zIndex={3000}
              zIndexInverse={1000}
            />

            <Text style={styles.label}>For groups of 5+</Text>
            <DropDownPicker
              open={group5Open}
              value={group5Value}
              items={group5Items}
              setOpen={setGroup5Open}
              setValue={setGroup5Value}
              setItems={setGroup5Items}
              placeholder="10% discount"
              style={styles.dropdown}
              containerStyle={{ marginBottom: 16 }}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Early Bird Rates</Text>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Enable Early Bird Discount</Text>
          <Switch value={earlyBirdEnabled} onValueChange={setEarlyBirdEnabled} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cancellation Policy</Text>
        <DropDownPicker
          open={cancellationOpen}
          value={cancellationValue}
          items={cancellationOptions}
          setOpen={setCancellationOpen}
          setValue={setCancellationValue}
          setItems={setCancellationOptions}
          placeholder="Flexible (Full refund 24h prior)"
          style={styles.dropdown}
          containerStyle={{ marginBottom: 16 }}
          zIndex={1000}
          zIndexInverse={3000}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Group Size</Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Minimum Guests*</Text>
            <TextInput
              style={styles.input}
              value={minGuests}
              onChangeText={setMinGuests}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>Maximum Guests*</Text>
            <TextInput
              style={styles.input}
              value={maxGuests}
              onChangeText={setMaxGuests}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={[styles.switchRow, { marginTop: 12 }]}>
          <Text style={styles.label}>Auto-cancel if minimum guests not met within 24h of start</Text>
          <Switch value={autoCancel} onValueChange={setAutoCancel} />
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue to Step 4</Text>
      </TouchableOpacity>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  stepText: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: '#eee', borderRadius: 2, marginBottom: 24 },
  progressFill: { height: 4, backgroundColor: '#0F172A', borderRadius: 2 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  label: { fontSize: 14, marginBottom: 8, color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  button: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});