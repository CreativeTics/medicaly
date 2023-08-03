import { defineStore } from "pinia";

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  permissions: string[];
}

export const useAuthStore = defineStore("auth", {
  state: (): { user: User } => {
    return {
      user: {} as User,
    };
  },

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      this.$state.user = {
        id: "1",
        username: "admin",
        fullName: "Administrador",
        role: "admin",
        permissions: ["roles:create", "roles:read", "roles:edit"],
      };
      return username == "admin" && password == "admin";
    },
    async logout(): Promise<boolean> {
      return true;
    },
  },
});
