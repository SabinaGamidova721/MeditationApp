module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(expo|@expo|react-native|@react-native|expo-modules-core)/)"
  ],
};
