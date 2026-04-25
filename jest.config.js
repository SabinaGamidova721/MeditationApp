// module.exports = {
//   preset: "jest-expo",
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // transformIgnorePatterns: [
  //   "node_modules/(?!(expo|@expo|react-native|@react-native|expo-modules-core)/)"
  // ],
// };

// module.exports = {
//   preset: "jest-expo",

//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

//   transformIgnorePatterns: [
//     "node_modules/(?!(react-native|@react-native|expo(nent)?|@expo|expo-modules-core|@react-navigation|@react-native-async-storage)/)"
//   ],
// };

module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|expo|expo-.*|@expo|expo-modules-core|@react-native-community|react-native-safe-area-context|react-native-screens)/)",
  ],
};
