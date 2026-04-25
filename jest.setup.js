// import "@testing-library/jest-native/extend-expect";

// jest.mock("@react-navigation/native", () => ({
//   useNavigation: () => ({
//     navigate: jest.fn(),
//     goBack: jest.fn(),
//     addListener: jest.fn(() => jest.fn()),
//   }),
// }));

// jest.mock("@react-navigation/native-stack", () => ({
//   createNativeStackNavigator: jest.fn(),
// }));


const storage = {};

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn((key, value) => {
    storage[key] = value;
    return Promise.resolve();
  }),

  getItem: jest.fn((key) => {
    return Promise.resolve(storage[key] ?? null);
  }),

  removeItem: jest.fn((key) => {
    delete storage[key];
    return Promise.resolve();
  }),

  clear: jest.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
    return Promise.resolve();
  }),
}));

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock("expo-av", () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            playAsync: jest.fn(),
            stopAsync: jest.fn(),
            unloadAsync: jest.fn(),
          },
        })
      ),
    },
  },
}));



jest.mock("expo-local-authentication", () => ({
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },

  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1])),
  authenticateAsync: jest.fn(() =>
    Promise.resolve({
      success: true,
    })
  ),
}));


