// app.config.js
import 'dotenv/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) return 'com.ohanaexperiences.expoapp';
  if (IS_PREVIEW) return 'com.ohanaexperiences.expoapp';
  return 'com.ohanaexperiences.expoapp';
};

const getAppName = () => {
  if (IS_DEV) return 'Ohana Dev';
  if (IS_PREVIEW) return 'Ohana Preview';
  return 'Ohana';
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
    googleServicesFile: './google-services.json'
  },
  extra: {
    ...config.extra,
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  },
});