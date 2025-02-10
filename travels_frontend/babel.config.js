module.exports = {
    presets: ["babel-preset-expo"],
    plugins: [["module:react-native-dotenv"]],
  };  

  module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      "react-native-reanimated/plugin",
      ["module-resolver", {
        root: ["./"],
        alias: {
          "react-native$": "react-native-web"
        }
      }]
    ]
  };
  