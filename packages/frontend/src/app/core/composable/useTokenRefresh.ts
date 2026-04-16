import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/store/auth'
import { http } from '@/app/core/services/http'

/**
 * Decodes JWT payload without verification (just base64).
 * Returns the exp field in seconds, or 0 if not found.
 */
function getTokenExp(token: string): number {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return 0
    const payload = JSON.parse(atob(parts[1]))
    return payload.exp ?? 0
  } catch {
    return 0
  }
}

const REFRESH_BEFORE_SECONDS = 5 * 60 // refresh 5 min before expiration
const CHECK_INTERVAL_MS = 60 * 1000 // check every 60 seconds

/**
 * Composable that silently refreshes the JWT token before it expires.
 * Should be mounted once in the authenticated layout (Home.vue).
 */
export default function useTokenRefresh() {
  let intervalId: ReturnType<typeof setInterval> | null = null

  const tryRefresh = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || !authStore.token) return

    const exp = getTokenExp(authStore.token)
    if (exp === 0) return

    const now = Math.floor(Date.now() / 1000)
    const remaining = exp - now

    // Only refresh if within the refresh window
    if (remaining > REFRESH_BEFORE_SECONDS) return

    // Token already expired — can't refresh
    if (remaining <= 0) return

    try {
      const response = await http.post(
        '/auth/refresh',
        {},
        {
          headers: {
            Authorization: `${authStore.token}`,
          },
        },
      )

      if (response.data?.token) {
        // Update token in store (persisted via pinia-plugin-persistedstate)
        authStore.token = response.data.token

        // Also refresh user data from session
        const sessionResponse = await http.get('/auth/session', {
          headers: {
            Authorization: `${response.data.token}`,
          },
        })
        authStore.user = sessionResponse.data
      }
    } catch {
      // Refresh failed — don't force logout, let the normal 401 interceptor handle it
      console.warn('[token-refresh] Failed to refresh token')
    }
  }

  onMounted(() => {
    // Check immediately and then periodically
    tryRefresh()
    intervalId = setInterval(tryRefresh, CHECK_INTERVAL_MS)
  })

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  })
}
