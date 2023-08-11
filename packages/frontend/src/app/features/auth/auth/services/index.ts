import { PouchService, DB } from "@/app/services/pouch";

const pouch = new PouchService();

export async function login(username: string, password: string) {
  const result = await pouch.use(DB.AUTH).find({
    selector: {
      username,
      password,
    },
  });

  if (result!.length > 0) {
    return true;
  }

  return false;
}

export class User {
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
    this.username = username;
    this.password = password;
    this.fullName = fullName;
    this.role = role;
  }
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
