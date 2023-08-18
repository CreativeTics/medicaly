import { onBeforeUnmount, onMounted, ref } from 'vue'

export enum Formats {
  /** A raw fingerprint image (bitmap). */
  Raw = 1,
  /** A fingerprint image encoded into an intermediate format. */
  Intermediate = 2,
  /** A compressed fingerprint image (e.q. JPEG2000, WSQ). */
  Compressed = 3,
  /** A Portable Network Graphics (PNG) format. */
  PngImage = 5,
}

export enum DeviceStatus {
  /** The device is connected. */
  Connected = 'connected',
  /** The device is disconnected. */
  Disconnected = 'disconnected',
}

export const useFingerprint = () => {
  let reader: any = null
  const deviceStatus = ref<DeviceStatus>(DeviceStatus.Disconnected)

  const init = async () => {
    try {
      // @ts-ignore
      reader = new Fingerprint.WebApi()

      reader.onDeviceConnected = function (e: any) {
        // Detects if the device is connected for which acquisition started
        console.log('onDeviceConnected', e)
        deviceStatus.value = DeviceStatus.Connected
      }
      reader.onDeviceDisconnected = function () {
        // Detects if device gets disconnected - provides deviceUid of disconnected device
        console.log('Device disconnected')
        deviceStatus.value = DeviceStatus.Disconnected
      }
      reader.onCommunicationFailed = function (e: any) {
        // Detects if there is a failure in communicating with U.R.U web reader
        console.log('Communication Failed', e)
        // deviceStatus.value = DeviceStatus.Disconnected
      }

      reader.onSamplesAcquired = function (s: any) {
        // This event is fired when fingerprint is successfully captured by the U.R.U web reader
        console.log('onSamplesAcquired', s)
      }

      reader.onQualityReported = function (e: any) {
        // This event is fired when fingerprint quality is reported by the U.R.U web reader
        console.log('onQualityReported', e)
      }

      reader.onErrorOccurred = function (e: any) {
        // This event is fired when any error is reported by the U.R.U web reader
        console.log('onErrorsOccurred', e)
      }

      console.log('init', reader)
      console.log('enumerateDevices', await reader.enumerateDevices())
      startAcquisition()
    } catch (err) {
      console.error('error', err)
    }
  }

  const enumerateDevices = async () => {
    try {
      const devices = await reader.enumerateDevices()
      console.log('enumerateDevices', devices)
    } catch (err) {
      console.error('error', err)
    }
  }

  const startAcquisition = async (format = Formats.PngImage) => {
    try {
      await reader.startAcquisition(format)
    } catch (err) {
      console.error('error', err)
    }
  }

  const stopAcquisition = async () => {
    try {
      await reader.stopAcquisition()
    } catch (err) {
      console.error('error', err)
    }
  }

  onMounted(() => {
    init()
  })
  onBeforeUnmount(() => {
    stopAcquisition()
    reader = null
  })

  return {
    reader,
    init,
    enumerateDevices,
    deviceStatus,
    startAcquisition,
    stopAcquisition,
  }
}
