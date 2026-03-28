import { User } from "../models/User";

export const CURRENT_USER = new User(
  "1",
  "Anna",
  "anna@mail.com",
  true,
  new Date(),

  undefined,
  12,   // sessions
  340,  // minutes
  5,    // streak
  2     // level
);
