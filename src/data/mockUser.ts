import { User } from "../models/User";

export const CURRENT_USER = new User(
  "1",
  "Anna",
  "anna@mail.com",
  true,
  new Date(),

  undefined,
  0, // sessions
  0, // minutes
  0, // streak
  1  // level
);
