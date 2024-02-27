import { ref, reactive, onBeforeUnmount, onMounted } from 'vue'

/**
 * A Vue composable function that tracks user idle time and triggers a callback when the user is idle for a specified duration.
 *
 * @param duration - The duration of idle time (in seconds) after which the user is considered idle.
 * @param reminder - The duration of idle time (in seconds) after which a reminder is shown to the user.
 * @param onIdle - The callback function to be called when the user is idle for the specified duration.
 * @param events - The list of events to listen to for user activity. Defaults to `["mousemove", "keypress"]`.
 *
 * @returns An object containing the `display` object with `minutes` and `seconds` properties representing the remaining idle time in minutes and seconds respectively, `isIdle` boolean indicating whether the user is currently idle, `isRemind` boolean indicating whether a reminder should be shown to the user, and `idleTime` number representing the total idle time in seconds.
 */
export default function useIdle(
  duration: number,
  reminder: number,
  onIdle: () => void,
  events: string[] = ['mousemove', 'keypress']
) {
  let intervalID: number = 0
  const start = ref<number>(0)
  const idleTime = ref<number>(0)
  const remaining = ref<number>(0)
  const isIdle = ref<boolean>(true)
  const isRemind = ref<boolean>(false)
  const display = reactive({
    minutes: '',
    seconds: '',
  })

  const init = () => {
    events.forEach((event) => {
      window.addEventListener(event, restartTimer)
    })
    intervalID = setInterval((): void => {
      validate()
    }, 1000)
    restartTimer()
  }

  const setDisplay = () => {
    const minutes = Math.floor(remaining.value / 60)
    const seconds = remaining.value - minutes * 60
    display.minutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    display.seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
  }

  const restartTimer = () => {
    isIdle.value = false
    isRemind.value = false
    start.value = Date.now()
    setDisplay()
  }

  const validate = () => {
    // seconds since start
    const diff = Math.round((Date.now() - start.value) / 1000)
    idleTime.value = diff
    remaining.value = duration - diff > 0 ? duration - diff : 0

    setDisplay()

    // reminder
    if (reminder > 0) {
      if (idleTime.value > reminder) {
        isRemind.value = true
      } else {
        isRemind.value = false
      }
    }
    // idle
    if (idleTime.value > duration) {
      isIdle.value = true
      onIdle()
    } else {
      isIdle.value = false
    }
  }

  onMounted(() => {
    init()
  })

  onBeforeUnmount(() => {
    clearInterval(intervalID)
    events.forEach((event) => {
      window.removeEventListener(event, restartTimer)
    })
  })

  return { display, isIdle, isRemind, idleTime }
}
