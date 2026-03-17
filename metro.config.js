const { getDefaultConfig } = require("expo/metro-config");

// We point directly to the file to bypass resolution issues
const {
  withNativeWind,
} = require("./node_modules/nativewind/dist/metro/index");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
