module.exports = {
  presets: [
    "babel-preset-expo",
    "module:metro-react-native-babel-preset"
  ],
  plugins: [
    "react-native-reanimated/plugin",
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "safe": true,
      "allowUndefined": false
    }],
    ["module-resolver", {
      root: ["./"],
      alias: {
        "react-native$": "react-native-web"
      }
    }]
  ]
};