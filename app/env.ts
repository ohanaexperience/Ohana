// lib/env.ts
import Constants from 'expo-constants';

export const GOOGLE_IOS_CLIENT_ID =
  process.env.GOOGLE_IOS_CLIENT_ID || Constants?.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID;

export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.GOOGLE_ANDROID_CLIENT_ID || Constants?.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID;

export const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || Constants?.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;