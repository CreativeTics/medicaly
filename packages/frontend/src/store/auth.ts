import { http } from '@/app/core/services/http'
import router from '@/router'
import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  type: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
  relations: string[]
  // relation[]
}
// interface relation {
//   contractId: string
//   contractName: string
//   subsidiaries: string[]
// }

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => {
    return {
      user: {} as User | null,
      token: '',
    }
  },
  getters: {
    isAuthenticated(): boolean {
      return !!this.token
    },
  },

  actions: {
    async setSession(user: User, token: string): Promise<void> {
      this.user = user
      this.token = token
    },

    async logout(): Promise<boolean> {
      await http.post('/auth/logout', {
        token: this.$state.token,
      })
      this.user = null as any
      this.token = ''
      router.push({ name: 'auth.login' })
      return true
    },
  },
})
