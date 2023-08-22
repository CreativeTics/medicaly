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

  GettingSamples = 'getting-samples',
}

export const useFingerprint = (onSampleAcquired: () => void) => {
  let reader: any = null
  const tempSample = ref<any>(null)
  const fingerprintImage = ref<string>('')
  const deviceStatus = ref<DeviceStatus>(DeviceStatus.Disconnected)

  const init = async () => {
    try {
      // @ts-ignore
      reader = new Fingerprint.WebApi()

      reader.onDeviceConnected = function (e: any) {
        // Detects if the device is connected for which acquisition started
        console.log('onDeviceConnected', e)
      }
      reader.onDeviceDisconnected = function () {
        // Detects if device gets disconnected - provides deviceUid of disconnected device
        console.log('Device disconnected')
        deviceStatus.value = DeviceStatus.Disconnected
      }
      // reader.onCommunicationFailed = function (e: any) {
      //   // Detects if there is a failure in communicating with U.R.U web reader
      //   // console.log('Communication Failed', e)
      //   // deviceStatus.value = DeviceStatus.Disconnected
      // }

      reader.onSamplesAcquired = function (s: any) {
        // This event is fired when fingerprint is successfully captured by the U.R.U web reader
        console.log('onSamplesAcquired', s)
        tempSample.value = s

        if (s.sampleFormat === 5 && s.samples?.length > 0) {
          const samples = JSON.parse(s.samples)
          fingerprintImage.value = toImagePng(samples[0])
        }
        if (onSampleAcquired) onSampleAcquired()
        stopAcquisition()
      }

      reader.onQualityReported = function (e: any) {
        // This event is fired when fingerprint quality is reported by the U.R.U web reader
        console.log('onQualityReported', e)
      }

      reader.onErrorOccurred = function (e: any) {
        // This event is fired when any error is reported by the U.R.U web reader
        console.log('onErrorsOccurred', e)
      }

      console.log('enumerateDevices', await enumerateDevices())

      console.log('init', reader)
    } catch (err) {
      console.error('error', err)
    }
  }

  const enumerateDevices = async () => {
    try {
      const devices = await reader.enumerateDevices()
      console.log('enumerateDevices', devices)
      if (devices.length > 0) {
        deviceStatus.value = DeviceStatus.Connected
      }
    } catch (err) {
      console.error('error', err)
    }
  }

  const startAcquisition = async (format = Formats.PngImage) => {
    try {
      await reader
        .startAcquisition(format)
        .then(() => {
          console.log('Acquisition started successfully')
          deviceStatus.value = DeviceStatus.GettingSamples
        })
        .catch((err: any) => {
          console.error('error', err)
        })
    } catch (err) {
      console.error('error', err)
    }
  }

  const stopAcquisition = async () => {
    try {
      await reader.stopAcquisition()
      console.log('Acquisition stopped successfully')
      deviceStatus.value = DeviceStatus.Connected
    } catch (err) {
      console.error('error', err)
    }
  }

  const toImagePng = (sampleStr: string): string => {
    // @ts-ignore
    return `data:image/png;base64, ${Fingerprint.b64UrlTo64(sampleStr)}`
  }

  onMounted(() => {
    console.log('Mounted useFingerprint')
    init()
  })
  onBeforeUnmount(() => {
    console.log('Unmonted useFingerprint')

    stopAcquisition()
    reader = null
  })

  return {
    reader,
    tempSample,
    fingerprintImage,
    init,
    enumerateDevices,
    deviceStatus,
    startAcquisition,
    stopAcquisition,
  }
}
