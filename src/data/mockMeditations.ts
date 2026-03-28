import { Meditation } from "../models/Meditation";


export const MEDITATIONS = [
  new Meditation(
    "1",
    "Morning Calm",
    "Start your day relaxed",
    "Relax",
    [1, 5, 10, 15],
    false,
    new Date()
  ),
  new Meditation(
    "2",
    "Deep Focus",
    "Boost concentration",
    "Focus",
    [10, 20, 30],
    true,
    new Date()
  ),
  new Meditation(
    "3",
    "Sleep Meditation",
    "Fall asleep faster",
    "Sleep",
    [10, 20, 40],
    false,
    new Date()
  ),
];
