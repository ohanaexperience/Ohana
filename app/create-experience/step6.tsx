import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { COMMON_STYLES as S, COLORS } from '../../constants/theme';
import { useExperienceStore } from '../store/experience';

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
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const durationOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1} hour${i === 0 ? '' : 's'}`,
    value: i + 1,
  }));

  const [timeSlotOptions, setTimeSlotOptions] = useState(
    Array.from({ length: 24 }, (_, hour) => {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return {
        label: `${displayHour}:00 ${period}`,
        value: `${displayHour}:00 ${period}`,
      };
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

  const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
    };

    const getLocalDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day); // JS Date uses 0-based months
};

function getSafeLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day, 12); // Use noon to prevent timezone offset shifting
}

  const handleOneTimeDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  if (event.type === 'set' && selectedDate) {
    const year = selectedDate.getFullYear();
    const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${selectedDate.getDate()}`.padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;
    setStep6({ availability: { ...step6.availability, startDate: localDateString } });
  }
  setShowDatePicker(false);
};
  

  const handleOneTimeTimeChange = (callback: (val: string) => string) => {
    const newTime = callback(step6.availability.timeSlots[0] || '10:00');
    setStep6({ availability: { ...step6.availability, timeSlots: [newTime] } });
  };

  const handleRecurringTimeChange = (index: number, callback: (val: string) => string) => {
  const current = step6.availability.timeSlots[index] || '10:00';
  const updated = step6.availability.timeSlots.map((t, i) =>
    i === index ? callback(current) : t
  );
  setStep6({ availability: { ...step6.availability, timeSlots: updated } });
};

  const handleAvailabilityTypeChange = (type: 'recurring' | 'one-time') => {
    if (step6.availabilityType !== type) {
      const today = new Date().toISOString().split('T')[0];
      const resetAvailability = {
        startDate: today,
        daysOfWeek: [],
        timeSlots: type === 'one-time' ? [] : ['10:00'],
      };
      resetStep6({ duration: durationValue });
      setStep6({ availabilityType: type, availability: resetAvailability });
    }
  };

  useEffect(() => {
    setStep6({ duration: durationValue });
  }, [durationValue]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
console.log('Step 6 data:', step6);
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
            setValue={setDurationValue}
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
                  step6.availabilityType === type && styles.toggleButtonSelected,
                ]}
                onPress={() => handleAvailabilityTypeChange(type as 'recurring' | 'one-time')}
              >
                <Text style={{
                  color: step6.availabilityType === type ? '#fff' : COLORS.text,
                  fontWeight: '600',
                }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {step6.availabilityType === 'recurring' ? (
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
                    <Text style={{
                      color: step6.availability.daysOfWeek.includes(idx) ? '#fff' : COLORS.text,
                      fontWeight: '600',
                    }}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[S.sectionTitle, { marginTop: 16 }]}>Time Slots</Text>
              {step6.availability.timeSlots.map((value, index) => (
                <View key={index} style={[styles.row, { marginBottom: 12 }]}>
                  <View style={{ flex: 1, zIndex: 1000 - index }}>
                    <DropDownPicker
                        open={timeSlotOpen === index}
                        value={step6.availability.timeSlots[index]}
                        items={timeSlotOptions}
                        setOpen={(open) => setTimeSlotOpen(open ? index : null)}
                        setValue={(cb) => handleRecurringTimeChange(index, cb)}
                        setItems={setTimeSlotOptions}
                        style={dropdownStyle}
                        dropDownContainerStyle={dropdownContainerStyle}
                        />
                    </View>
                  {index === step6.availability.timeSlots.length - 1 ? (
                    <TouchableOpacity onPress={handleAddTimeSlot} style={styles.addButton}>
                      <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleRemoveTimeSlot(index)}
                      style={[styles.addButton, { backgroundColor: 'black' }]}
                    >
                      <Ionicons name="remove" size={20} color="white" />
                    </TouchableOpacity>
                  )}
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
                    ? new Date(step6.availability.startDate).toDateString()
                    : 'Pick a date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
               <DateTimePicker
  value={
  step6.availability.startDate
    ? new Date(step6.availability.startDate + 'T12:00:00')
    : new Date()
}
  mode="date"
  display={Platform.OS === 'ios' ? 'inline' : 'default'}
  themeVariant="light"
  onChange={(event, date) => {
    if (event.type === 'set' && date) {
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const year = localDate.getFullYear();
      const month = `${localDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${localDate.getDate()}`.padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      setStep6({ availability: { ...step6.availability, startDate: formatted } });
    }
    setShowDatePicker(false);
  }}
/>
              )}

              <Text style={[S.sectionTitle, { marginTop: 16 }]}>Start Time</Text>
              <DropDownPicker
                open={timeSlotOpen === 0}
                value={step6.availability.timeSlots[0] || '10:00'}
                items={timeSlotOptions}
                setOpen={(open) => setTimeSlotOpen(open ? 0 : null)}
                setValue={handleOneTimeTimeChange}
                setItems={setTimeSlotOptions}
                style={dropdownStyle}
                dropDownContainerStyle={dropdownContainerStyle}
              />
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