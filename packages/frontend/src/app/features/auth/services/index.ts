import { PouchService, DB } from "../../../services/pouch";

const pouch = new PouchService();

export async function login(username: string, password: string) {
  const result = await pouch.use(DB.AUTH).find({
    selector: {
      username,
      password,
    },
  });

  if (result!.docs.length > 0) {
    return true;
  }

  return false;
}

export interface User {
  username: string;
  password: string;
  fullName: string;
  role: string;
}

export async function createUser(user: User) {
  return pouch.use(DB.AUTH).create(user);
}
