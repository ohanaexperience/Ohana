import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { COMMON_STYLES as S, COLORS } from '../../constants/theme';
import { useRouter, useNavigation } from 'expo-router';
import { useExperienceStore } from '../store/experience';

export default function CreateExperienceStep3() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create Experience',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const {
    step3,
    setStep3,
  } = useExperienceStore();

  const [basePrice, setBasePrice] = useState(step3.basePrice || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [groupRatesEnabled, setGroupRatesEnabled] = useState(!!step3.groupDiscounts);
  const [group3Open, setGroup3Open] = useState(false);
  const [group3Value, setGroup3Value] = useState(step3.groupDiscounts?.discountPercentageFor3Plus ?? null);
  const [group3Options, setGroup3Options] = useState([
    { label: '5% discount', value: 5 },
    { label: '10% discount', value: 10 },
    { label: '15% discount', value: 15 },
    { label: '20% discount', value: 20 },
    { label: '25% discount', value: 25 },
  ]);

  const [group5Open, setGroup5Open] = useState(false);
  const [group5Value, setGroup5Value] = useState(step3.groupDiscounts?.discountPercentageFor5Plus ?? null);
  const [group5Options, setGroup5Options] = useState([
    { label: '10% discount', value: 10 },
    { label: '15% discount', value: 15 },
    { label: '20% discount', value: 20 },
    { label: '25% discount', value: 25 },
    { label: '30% discount', value: 30 },
  ]);

  const [earlyBirdEnabled, setEarlyBirdEnabled] = useState(!!step3.earlyBirdRate);
  const [daysEarly, setDaysEarly] = useState(false);
  const [daysEarlyValue, setDaysEarlyValue] = useState(step3.earlyBirdRate?.daysInAdvance ?? null);
  const [daysEarlyOptions, setDaysEarlyOptions] = useState(Array.from({ length: 17 }, (_, i) => ({
    label: `${14 + i} days early`,
    value: 14 + i
  })));

  const [earlyBirdDiscountOpen, setEarlyBirdDiscountOpen] = useState(false);
  const [earlyBirdDiscountValue, setEarlyBirdDiscountValue] = useState(step3.earlyBirdRate?.discountPercentage ?? null);
  const [earlyBirdDiscountOptions, setEarlyBirdDiscountOptions] = useState([
    { label: '5% discount', value: 5 },
    { label: '10% discount', value: 10 },
    { label: '15% discount', value: 15 },
    { label: '25% discount', value: 25 },
  ]);

  const [cancellationOpen, setCancellationOpen] = useState(false);
  const [cancellationValue, setCancellationValue] = useState(step3.cancellationPolicy ?? null);
  const [cancellationOptions, setCancellationOptions] = useState([
    { label: 'Flexible (Full refund 24h prior)', value: 'flexible' },
    { label: 'Moderate (50% refund 24h prior)', value: 'moderate' },
    { label: 'Strict (No refund)', value: 'strict' },
  ]);

  const [minGuests, setMinGuests] = useState(step3.minGuests.toString());
  const [maxGuests, setMaxGuests] = useState(step3.maxGuests.toString());
  const [autoCancel, setAutoCancel] = useState(step3.autoCancelIfMinNotMet);

  useEffect(() => {
    const groupDiscounts = groupRatesEnabled ? {
      discountPercentageFor3Plus: group3Value || undefined,
      discountPercentageFor5Plus: group5Value || undefined,
    } : undefined;

    const earlyBirdRate = earlyBirdEnabled ? {
      daysInAdvance: daysEarlyValue || undefined,
      discountPercentage: earlyBirdDiscountValue || undefined,
    } : undefined;

    setStep3({
      basePrice,
      cancellationPolicy: cancellationValue,
      minGuests: Number(minGuests),
      maxGuests: Number(maxGuests),
      autoCancelIfMinNotMet: autoCancel,
      groupDiscounts,
      earlyBirdRate,
    });
  }, [
    basePrice,
    cancellationValue,
    minGuests,
    maxGuests,
    autoCancel,
    groupRatesEnabled,
    group3Value,
    group5Value,
    earlyBirdEnabled,
    daysEarlyValue,
    earlyBirdDiscountValue,
  ]);

  // ... rest of component remains unchanged

// (No changes made to visual component JSX or styles)


  const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

  if (!basePrice || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
    newErrors.basePrice = 'Enter a valid price';
  }

  if (!minGuests || isNaN(Number(minGuests)) || Number(minGuests) < 1) {
    newErrors.minGuests = 'Minimum guests is 1';
  }

  if (!maxGuests || isNaN(Number(maxGuests)) || Number(maxGuests) < Number(minGuests) ) {
    newErrors.maxGuests = 'Maximum guests must be greater than or equal to minimum guests';
  }

  if ( Number(maxGuests) > 10) {
    newErrors.maxGuests = 'Maximum 10 guests';
  }

  if (!cancellationValue) {
    newErrors.cancellationPolicy = 'Select a cancellation policy';
  }

  if (groupRatesEnabled) {
    if (!group3Value && !group5Value) newErrors.group3 = 'Select one or both group discounts';
    
  }

  if (earlyBirdEnabled) {
    if (!daysEarlyValue) newErrors.daysEarly = 'Select days in advance';
    if (!earlyBirdDiscountValue) newErrors.earlyBird = 'Select early bird discount';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const formData = {
    basePrice,
    cancellationPolicy: cancellationValue,
    minGuests: Number(minGuests),
    maxGuests: Number(maxGuests),
    autoCancelIfMinNotMet: autoCancel,
    };

    if (groupRatesEnabled) {
        formData.groupDiscounts = {
            discountPercentageFor3Plus: group3Value ? Number(group3Value) : undefined,
            discountPercentageFor5Plus: group5Value ? Number(group5Value) : undefined,
        };
    }
    else{
        formData.groupDiscounts = undefined;
    }

    if (earlyBirdEnabled) {
        formData.earlyBirdRate = {
            daysInAdvance: daysEarlyValue ? Number(daysEarlyValue) : undefined,
            discountPercentage: earlyBirdDiscountValue ? Number(earlyBirdDiscountValue) : undefined,
        };
    }
    else {
        formData.earlyBirdRate = undefined;
    }

    // Pretty print
    console.log('Step 3 Form State:\n' + JSON.stringify(formData, null, 2));
    console.log(step3)
  return (
    <KeyboardAwareScreen>
      <Text style={S.stepText}>Step 3 of 7</Text>
      <View style={S.progressBar}>
        <View style={[S.progressFill, { width: '42%' }]} />
      </View>

      <Text style={S.title}>Set Pricing & Group Size</Text>
      <Text style={S.subtitle}>Set your experience pricing and capacity limits</Text>

      <View style={cardStyle}>
        <Text style={S.sectionTitle}>Base Price</Text>
        <Text style={labelStyle}>Price per Person</Text>
        <TextInput
          style={S.input}
          value={basePrice}
          onChangeText={setBasePrice}
          placeholder="$ 0.00"
          placeholderTextColor={COLORS.gray}
          keyboardType="numeric"
        />
        {errors.basePrice && <Text style={errorStyle}>{errors.basePrice}</Text>}
      </View>

      <View style={cardStyle}>
        <Text style={S.sectionTitle}>Group Discounts</Text>
        <View style={switchRow}>
          <Text style={labelStyle}>Enable Group Rates</Text>
          <Switch value={groupRatesEnabled} onValueChange={setGroupRatesEnabled} />
        </View>
        {groupRatesEnabled && (
          <>
            <Text style={labelStyle}>For groups of 3+</Text>
            <View style={{ zIndex: 3000, marginBottom: 16 }}>
              <DropDownPicker
                open={group3Open}
                value={group3Value}
                items={group3Options}
                setOpen={setGroup3Open}
                setValue={setGroup3Value}
                setItems={setGroup3Options}
                placeholder="Select discount"
                style={dropdownStyle}
                dropDownContainerStyle={{ borderColor: '#ccc', backgroundColor: '#fff', zIndex: 3000 }}
                zIndex={3000}
              />
            </View>

            <Text style={labelStyle}>For groups of 5+</Text>
            <View style={{ zIndex: 2000, marginBottom: 16 }}>
              <DropDownPicker
                open={group5Open}
                value={group5Value}
                items={group5Options}
                setOpen={setGroup5Open}
                setValue={setGroup5Value}
                setItems={setGroup5Options}
                placeholder="Select discount"
                style={dropdownStyle}
                dropDownContainerStyle={{ borderColor: '#ccc', backgroundColor: '#fff', zIndex: 2000 }}
                zIndex={2000}
              />
            </View>

            {errors.group3 && <Text style={errorStyle}>{errors.group3}</Text>}
            
          </>
        )}
        
      </View>

    

      <View style={cardStyle}>
        <Text style={S.sectionTitle}>Early Bird Rates</Text>
        <View style={switchRow}>
          <Text style={labelStyle}>Enable Early Bird Discount</Text>
          <Switch value={earlyBirdEnabled} onValueChange={setEarlyBirdEnabled} />
        </View>
        {earlyBirdEnabled && (
          <>
            <Text style={labelStyle}>Days in Advance</Text>
            <View style={{ zIndex: 1900, marginBottom: 16 }}>
              <DropDownPicker
                open={daysEarly}
                value={daysEarlyValue}
                items={daysEarlyOptions}
                setOpen={setDaysEarly}
                setValue={setDaysEarlyValue}
                setItems={setDaysEarlyOptions}
                placeholder="Days in Advance"
                style={dropdownStyle}
                dropDownContainerStyle={{ borderColor: '#ccc', backgroundColor: '#fff', zIndex: 1900 }}
                zIndex={1900}
              />
            </View>
            

            <Text style={labelStyle}>Discount</Text>
            <View style={{ zIndex: 1800, marginBottom: 16 }}>
            <DropDownPicker
                open={earlyBirdDiscountOpen}
                value={earlyBirdDiscountValue}
                items={earlyBirdDiscountOptions}
                setOpen={setEarlyBirdDiscountOpen}
                setValue={setEarlyBirdDiscountValue}
                setItems={setEarlyBirdDiscountOptions}
                placeholder="Select discount"
                style={dropdownStyle}
                dropDownContainerStyle={{ borderColor: '#ccc', backgroundColor: '#fff', zIndex: 1800 }}
                zIndex={1800}
            />
            </View>
            {errors.daysEarly && <Text style={errorStyle}>{errors.daysEarly}</Text>}
            {errors.earlyBird && <Text style={errorStyle}>{errors.earlyBird}</Text>}
          </>
        )}
      </View>

      <View style={cardStyle}>
        <Text style={S.sectionTitle}>Cancellation Policy</Text>
        <View style={{ zIndex: 1000, marginBottom: 16 }}>
          <DropDownPicker
            open={cancellationOpen}
            value={cancellationValue}
            items={cancellationOptions}
            setOpen={setCancellationOpen}
            setValue={setCancellationValue}
            setItems={setCancellationOptions}
            placeholder="Select policy"
            style={dropdownStyle}
            dropDownContainerStyle={{ borderColor: '#ccc', backgroundColor: '#fff', zIndex: 1000 }}
            zIndex={1000}
          />
        </View>
        {errors.cancellationPolicy && <Text style={errorStyle}>{errors.cancellationPolicy}</Text>}
      </View>

      <View style={cardStyle}>
        <Text style={S.sectionTitle}>Group Size</Text>
        <View style={rowStyle}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={labelStyle}>Minimum Guests*</Text>
            <TextInput
              style={S.input}
              value={minGuests}
              onChangeText={setMinGuests}
              keyboardType="number-pad"
              placeholder="1"
              placeholderTextColor={COLORS.gray}
            />
            
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={labelStyle}>Maximum Guests*</Text>
            <TextInput
              style={S.input}
              value={maxGuests}
              onChangeText={setMaxGuests}
              keyboardType="number-pad"
              placeholder="10"
              placeholderTextColor={COLORS.gray}
            />
            
          </View>
         
        </View>

        {errors.minGuests && <Text style={errorStyle}>{errors.minGuests}</Text>}
        {errors.maxGuests && <Text style={errorStyle}>{errors.maxGuests}</Text>}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
        <View style={{ marginRight: 12 }}>
            <Switch value={autoCancel} onValueChange={setAutoCancel} />
        </View>
        <Text style={[labelStyle, { flex: 1 }]}>
            Auto-cancel if minimum guests not met within 24h of start
        </Text>
        </View>
      </View>

    <TouchableOpacity
        style={[S.button, { marginTop: 24, opacity: 1 }]}
        onPress={() => {
            
        if (validateForm()) {
            router.push('./step4');
        } else {
        
        }
        }}
        >
        <Text style={S.buttonText}>Continue to Step 4</Text>
    </TouchableOpacity>

    </KeyboardAwareScreen>
  );
}

const cardStyle = {
  backgroundColor: '#F9FAFB',
  padding: 16,
  borderRadius: 12,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#E5E7EB',
};

const switchRow = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
};

const labelStyle = {
  fontSize: 14,
  marginBottom: 8,
  color: '#374151',
};

const dropdownStyle = {
  borderColor: '#ccc',
  borderRadius: 6,
  backgroundColor: '#fff',
};

const rowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const errorStyle = {
  color: '#EF4444',
  fontSize: 12,
  marginTop: 4,
};