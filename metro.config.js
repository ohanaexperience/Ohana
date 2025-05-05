// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...(config.resolver.extraNodeModules || {}),
    // stub ONLY the RN codegen helper
    'react-native/Libraries/Utilities/codegenNativeCommands': path.resolve(__dirname, 'web/empty.js'),
  },
};

module.exports = config;