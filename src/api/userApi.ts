import { delay } from "./utils";
import { User } from "../models/User";
import { CURRENT_USER } from "../data/mockUser";

/*
API-контракт:

GET /user
Повертає: User
Тіло/параметри: немає
*/

const cloneUser = (user: User) =>
  new User(
    user.id,
    user.name,
    user.email,
    user.isPremium,
    new Date(user.createdAt),
    user.avatar,
    user.sessions,
    user.minutes,
    user.streak,
    user.level
  );

let remoteUser = cloneUser(CURRENT_USER);

export const userApi = {
  async fetchUser(): Promise<User> {
    console.log("API GET /user");
    await delay(500);
    return cloneUser(remoteUser);
  },
};
