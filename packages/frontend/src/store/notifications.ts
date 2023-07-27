import { defineStore } from "pinia";
// @ts-ignore
import { v4 } from "uuid";

interface ToastNotification {
  id?: string;
  title: string;
  text?: string;
  type?: "success" | "error" | "warning" | "info";
  time?: number;
}

export const useNotificationsStore = defineStore("notifications", {
  state: () => {
    return {
      notifications: [] as ToastNotification[],
    };
  },

  actions: {
    addNotification(notification: ToastNotification) {
      notification.id = v4();
      this.notifications.push(notification);
    },

    removeNotification(id: string) {
      this.notifications = this.notifications.filter((n: any) => n.id !== id);
    },
  },
});
