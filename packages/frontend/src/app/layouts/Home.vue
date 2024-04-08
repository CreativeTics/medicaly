<script setup lang="ts">
import Sidebar from '@components/Sidebar.vue'
import DToastStack from '@components/DToastStack.vue'
import DIdleLogoutOverlay from '../components/DIdleLogoutOverlay.vue'
import { useAuthStore } from '../../store/auth'

import { useRouter } from 'vue-router'

import { menuFilteredByPermissions } from '../../config'

const authStore = useAuthStore()

const router = useRouter()

const changeRoute = (route: string) => {
  console.log(route)
  router.push(route)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <DIdleLogoutOverlay />
  <DToastStack class="left-14" />
  <main class="h-screen w-screen text-gray-900 bg-gray-50 flex">
    <Sidebar
      :menu="
        menuFilteredByPermissions(useAuthStore().user?.role.permissions ?? [])
      "
      :user="{
        email: '',
        name: authStore.user?.username || '',
        role: authStore.user?.role?.name || '',
        roleCode: authStore.user?.role?.id || '',
        photoUrl: '',
      }"
      @change:route="changeRoute"
      @logout="handleLogout"
    >
    </Sidebar>
    <div class="w-full h-full overflow-hidden mb-1">
      {{ useAuthStore().token }}
      {{ useAuthStore().user?.role.permissions }}
      <div class="w-full h-full p-5 overflow-hidden">
        <slot></slot>
      </div>
    </div>
  </main>
</template>
