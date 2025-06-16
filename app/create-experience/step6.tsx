import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { COMMON_STYLES as S, COLORS } from '../../constants/theme';
import { useExperienceStore } from '../store/experience';
import DatePicker from 'react-native-date-picker';
import { format, parseISO } from 'date-fns';

export default function CreateExperienceStep6() {
  const {
    step6,
    setStep6,
    resetStep6,
  } = useExperienceStore();

  const [durationOpen, setDurationOpen] = useState(false);
  const [durationValue, setDurationValue] = useState(step6.duration || 1);
  const [timeSlotOpen, setTimeSlotOpen] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [availabilityType, setAvailabilityType] = useState<'recurring' | 'one-time'>('recurring');

  const durationOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1} hour${i === 0 ? '' : 's'}`,
    value: i + 1,
  }));

  const [timeSlotOptions] = useState(
    Array.from({ length: 24 }, (_, hour) => {
      const label = `${hour.toString().padStart(2, '0')}:00`;
      return { label, value: label };
    })
  );

  const toggleDay = (index: number) => {
    const days = step6.availability.daysOfWeek.includes(index)
      ? step6.availability.daysOfWeek.filter((d) => d !== index)
      : [...step6.availability.daysOfWeek, index];
    setStep6({ availability: { ...step6.availability, daysOfWeek: days } });
  };

  const handleAddTimeSlot = () => {
    setStep6({
      availability: {
        ...step6.availability,
        timeSlots: [...step6.availability.timeSlots, '10:00'],
      },
    });
  };

  const handleRemoveTimeSlot = (index: number) => {
    const newSlots = step6.availability.timeSlots.filter((_, i) => i !== index);
    setStep6({ availability: { ...step6.availability, timeSlots: newSlots } });
  };

  const handleRecurringTimeChange = (index: number, newVal: string) => {
    const updated = step6.availability.timeSlots.map((t, i) =>
      i === index ? newVal : t
    );
    setStep6({ availability: { ...step6.availability, timeSlots: updated } });
  };

  const handleAvailabilityTypeChange = (type: 'recurring' | 'one-time') => {
    setAvailabilityType(type);
    const today = format(new Date(), 'yyyy-MM-dd');
    const resetAvailability = {
      startDate: today,
      daysOfWeek: [],
      timeSlots: ['10:00'],
    };
    resetStep6({ duration: durationValue });
    setStep6({ availability: resetAvailability });
  };

  useEffect(() => {
    if (availabilityType === 'recurring' && step6.availability.timeSlots.length === 0) {
      setStep6({
        availability: {
          ...step6.availability,
          timeSlots: ['10:00'],
        },
      });
    }
  }, [availabilityType]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
console.log('Step 6 Data:', step6);
  return (
    <KeyboardAwareScreen>
      <Text style={S.stepText}>Step 6 of 7</Text>
      <View style={S.progressBar}>
        <View style={[S.progressFill, { width: '86%' }]} />
      </View>

      <Text style={S.title}>Scheduling</Text>
      <Text style={S.subtitle}>Set your availability and session details</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={S.sectionTitle}>Experience Duration</Text>
          <DropDownPicker
            open={durationOpen}
            value={durationValue}
            items={durationOptions}
            setOpen={setDurationOpen}
            setValue={(callback) => {
                const value = callback(durationValue);
                setDurationValue(value);
                setStep6({ ...step6, duration: value });
            }}
            setItems={() => {}}
            style={dropdownStyle}
            dropDownContainerStyle={dropdownContainerStyle}
        />
        </View>

        <View style={styles.card}>
          <Text style={S.sectionTitle}>Availability Type</Text>
          <View style={styles.toggleRow}>
            {['recurring', 'one-time'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleButton,
                  availabilityType === type && styles.toggleButtonSelected,
                ]}
                onPress={() => handleAvailabilityTypeChange(type as 'recurring' | 'one-time')}
              >
                <Text
                  style={{
                    color: availabilityType === type ? '#fff' : COLORS.text,
                    fontWeight: '600',
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {availabilityType === 'recurring' ? (
            <>
              <Text style={[S.sectionTitle, { marginTop: 16 }]}>Days Available</Text>
              <View style={styles.daysRow}>
                {dayLabels.map((day, idx) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      step6.availability.daysOfWeek.includes(idx) && styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleDay(idx)}
                  >
                    <Text
                      style={{
                        color: step6.availability.daysOfWeek.includes(idx) ? '#fff' : COLORS.text,
                        fontWeight: '600',
                      }}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[S.sectionTitle, { marginTop: 16 }]}>Time Slots</Text>
              {step6.availability.timeSlots.map((value, index) => (
                <View key={index} style={[styles.row, { marginBottom: 12 }]}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => setTimeSlotOpen(index)}
                            style={styles.pickerButton}
                        >
                            <Text style={styles.pickerButtonText}>{value || 'Select a time'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={
                            index === step6.availability.timeSlots.length - 1
                            ? handleAddTimeSlot
                            : () => handleRemoveTimeSlot(index)
                        }
                        style={[
                            styles.addButton,
                            index === step6.availability.timeSlots.length - 1
                            ? {}
                            : { backgroundColor: 'black' },
                        ]}
                    >
                        <Ionicons
                            name={index === step6.availability.timeSlots.length - 1 ? 'add' : 'remove'}
                            size={20}
                            color="white"
                        />
                    </TouchableOpacity>

                    <Modal visible={timeSlotOpen === index} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                        <Picker
                            selectedValue={value}
                            onValueChange={(val) => handleRecurringTimeChange(index, val)}
                        >
                            {timeSlotOptions.map(({ label, value }) => (
                            <Picker.Item key={value} label={label} value={value} />
                            ))}
                        </Picker>
                        <TouchableOpacity
                            onPress={() => setTimeSlotOpen(null)}
                            style={styles.doneButton}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </Modal>
                </View>
                ))}
            </>
          ) : (
            <>
              <Text style={[S.sectionTitle, { marginTop: 16 }]}>Select a Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: COLORS.text, fontWeight: '500' }}>
                  {step6.availability.startDate
                    ? format(parseISO(step6.availability.startDate), 'EEE, MMM d, yyyy')
                    : 'Pick a date'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={showDatePicker}
                date={date}
                onConfirm={(selected) => {
                  const localDate = format(selected, 'yyyy-MM-dd');
                  setDate(new Date(localDate));
                  setStep6({
                    availability: {
                      ...step6.availability,
                      startDate: localDate,
                    },
                  });
                  setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
              />

              <Text style={[S.sectionTitle, { marginTop: 16 }]}>Start Time</Text>
              <TouchableOpacity
                onPress={() => setTimeSlotOpen(0)}
                style={styles.pickerButton}
              >
                <Text style={styles.pickerButtonText}>
                  {step6.availability.timeSlots[0] || 'Select a time'}
                </Text>
              </TouchableOpacity>
              <Modal visible={timeSlotOpen === 0} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Picker
                      selectedValue={step6.availability.timeSlots[0] || '10:00'}
                      onValueChange={(value) => {
                        setStep6({
                          availability: {
                            ...step6.availability,
                            timeSlots: [value],
                          },
                        });
                      }}
                    >
                      {timeSlotOptions.map(({ label, value }) => (
                        <Picker.Item key={value} label={label} value={value} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      onPress={() => setTimeSlotOpen(null)}
                      style={styles.doneButton}
                    >
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>
          )}
        </View>

        <TouchableOpacity style={[S.button, { marginTop: 24 }]}>
          <Text style={S.buttonText}>Continue to Step 7</Text>
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
  toggleRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  toggleButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    marginTop: 8,
    marginLeft: 12,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
  },
  dateButton: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  pickerButtonText: {
    color: COLORS.text,
    fontWeight: '500',
  },

  or: COLORS.text,
// }
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
  },
  doneButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

const dropdownStyle = {
  borderColor: '#ccc',
  borderRadius: 6,
  backgroundColor: '#fff',
};

const dropdownContainerStyle = {
  borderColor: '#ccc',
  backgroundColor: '#fff',
  zIndex: 2000,
};
