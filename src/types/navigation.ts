export type RootStackParamList = {
  Meditations: undefined;
  Details: { meditationId: string };
  Player: { meditationId: string; duration: number };
};
