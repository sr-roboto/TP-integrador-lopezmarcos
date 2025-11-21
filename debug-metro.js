try {
  const { getDefaultConfig } = require("@expo/metro-config");
  const { withNativeWind } = require('nativewind/metro');
  console.log("Modules loaded");
  
  const config = getDefaultConfig(__dirname);
  console.log("Config got");
  
  const finalConfig = withNativeWind(config, { input: './global.css' });
  console.log("Final config created");
} catch (e) {
  console.error("Error executing config:", e);
}
