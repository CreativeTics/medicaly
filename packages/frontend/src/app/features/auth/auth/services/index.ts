import { PouchService, DB } from "../../../services/pouch";
import { Entity } from "@/app/core/types/entity";

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

export class User extends Entity {
  username: string;
  password: string;
  fullName: string;
  role: string;

  constructor(
    username: string,
    password: string,
    fullName: string,
    role: string
  ) {
    super("users", pouch.use(DB.AUTH), pouch.use(DB.AUTH));
    this.username = username;
    this.password = password;
    this.fullName = fullName;
    this.role = role;
  }
}

export async function createUser(user: User) {
  new User().setValues(user);

  return;
}

export async function getUsers(): Promise<User[]> {
  const docs: any = await pouch
    .use(DB.AUTH)
    .find({ selector: { doctype: "users" } });

  return docs.map((doc: any) => ({
    id: doc._id,
    rev: doc._rev,
    username: doc.username,
    fullName: doc.fullName,
    role: doc.role,
  }));
}
