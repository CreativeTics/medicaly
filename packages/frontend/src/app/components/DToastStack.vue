<script setup lang="ts">
import { useNotificationsStore } from '@/store/notifications'
import DToastNotification from './DToastNotification.vue'

const store = useNotificationsStore()

const onClose = (id?: string) => {
  if (!id) return
  store.removeNotification(id)
}
</script>
<template>
  <div
    v-if="store.notifications.length !== 0"
    class="fixed bottom-0 z-50 px-11 py-7 sm:w-1/2 xl:w-1/4"
  >
    <DToastNotification
      v-for="notification in store.notifications"
      :key="notification.id"
      :title="notification.title"
      :text="notification.text"
      :type="notification.type"
      :time="notification.time"
      @close="onClose(notification?.id)"
    />
  </div>
</template>
