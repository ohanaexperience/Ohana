// lib/env.ts
import Constants from 'expo-constants';

const env = Constants?.expoConfig?.extra || {};

export const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || env.EXPO_PUBLIC_BACKEND_URL;

export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.GOOGLE_ANDROID_CLIENT_ID || env.GOOGLE_ANDROID_CLIENT_ID;

export const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || env.GOOGLE_MAPS_API_KEY;

export const FACEBOOK_APP_ID =
  process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || env.EXPO_PUBLIC_FACEBOOK_APP_ID;