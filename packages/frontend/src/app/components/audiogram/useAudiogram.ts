import { Frequency, FREQUENCIES } from './frequencies'
import { Threshold, THRESHOLDS } from './thresholds'

import { reactive, ref } from 'vue'
import { loadSymbols } from './symbols'

// class Point {
//   x: number
//   y: number
//   constructor(x: number, y: number) {
//     this.x = x
//     this.y = y
//   }
// }

// class EarPoint extends Point {
//   mask: Mask
//   transport: TransportType
//   constructor(x: number, y: number, mask: Mask, transport: TransportType) {
//     super(x, y)
//     this.mask = mask
//     this.transport = transport
//   }
// }

// class SoundFieldPoint extends Point {
//   constructor(x: number, y: number) {
//     super(x, y)
//   }
// }

// class Audiogram {
//   ear: {
//     left: Map<Frequencies, EarPoint>
//     right: Map<Frequencies, EarPoint>
//   }
//   soundField: {
//     unaided: Map<Frequencies, SoundFieldPoint>
//     aided: Map<Frequencies, SoundFieldPoint>
//     ci: Map<Frequencies, SoundFieldPoint>
//   }
//   constructor() {
//     this.ear = {
//       left: new Map(),
//       right: new Map(),
//     }
//     this.soundField = {
//       unaided: new Map(),
//       aided: new Map(),
//       ci: new Map(),
//     }
//   }
// }

interface AudiogramSettings {
  xOffset: number
  yOffset: number
  width: number
  height: number
}

export enum Type {
  Ear = 'ear',
  SoundField = 'soundField',
}

// export enum SoundField {
//   unaided = 'unaided',
//   aided = 'aided',
//   ci = 'ci',
// }

export enum Ear {
  Left = 'left',
  Right = 'right',
}

export enum TransportType {
  Air = 'air',
  Bone = 'bone',
}

export enum MaskType {
  UnMasked = 'unmasked',
  Masked = 'masked',
}

export interface SoundFieldPoint {
  frequency: Frequency
  threshold: Threshold
  x: number
  y: number
  willRemove?: boolean
}

export interface EarPoint extends SoundFieldPoint {
  mask: MaskType
}

// export interface Audiogram {
//   ear: {
//     left: Map<Frequencies, EarPoint>
//     right: Map<Frequencies, EarPoint>
//   }
//   soundField: {
//     unaided: Map<Frequencies, SoundFieldPoint>
//     aided: Map<Frequencies, SoundFieldPoint>
//     ci: Map<Frequencies, SoundFieldPoint>
//   }
// }
const ratio = window.devicePixelRatio || 1
const ICON_SIZE = 30 * ratio
const AUDIOGRAM_SYMBOLS = loadSymbols(ICON_SIZE)

export function useAudiogram(
  settings: AudiogramSettings = {
    xOffset: 40 * ratio,
    yOffset: 40 * ratio,
    width: 500 * ratio,
    height: 500 * ratio,
  }
) {
  // Draw grid

  let canvasAudiogram: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  const lineWidth =
    (settings.width - settings.xOffset * 2) /
    (Object.values(FREQUENCIES).filter((_) => _.show).length - 1)
  const lineHeight =
    (settings.height - settings.yOffset * 2) /
    (Object.values(THRESHOLDS).filter((_) => _.show).length - 1)

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    // Line styling
    ctx.lineWidth = 1
    ctx.strokeStyle = 'gray'

    drawHorizontalLines(ctx)
    drawVerticalLines(ctx)
  }
  const drawHorizontalLines = (ctx: CanvasRenderingContext2D) => {
    const yLabels = Object.values(THRESHOLDS).filter((_) => _.show)
    yLabels.forEach((_, i) => {
      // add Label
      ctx.font = '20px serif'
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        _.label,
        settings.xOffset / 2,
        i * lineHeight + settings.yOffset
      )

      ctx.beginPath()
      const y = i * lineHeight + settings.yOffset
      ctx.moveTo(settings.xOffset, y)

      ctx.lineTo(settings.width - settings.xOffset, y)
      ctx.stroke()
    })
  }

  const drawVerticalLines = (ctx: CanvasRenderingContext2D) => {
    const xLabels = Object.values(FREQUENCIES).filter((_) => _.show)
    xLabels.forEach((_, i) => {
      // add Label
      ctx.font = '20px serif'
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        _.label,
        i * lineWidth + settings.xOffset,
        settings.yOffset / 2
      )
      ctx.beginPath()
      const x = i * lineWidth + settings.xOffset
      ctx.moveTo(x, settings.yOffset)
      ctx.lineTo(x, settings.height - settings.yOffset)
      ctx.stroke()
    })
  }

  const addBackgroundGradient = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, settings.width, settings.height)

    ctx.strokeStyle = '#000000'
    ctx.strokeRect(0, 0, settings.width, settings.height)

    const gradient = ctx.createLinearGradient(0, 0, 0, settings.height)
    gradient.addColorStop(0.0, '#ffffff')
    gradient.addColorStop(0.2, '#ffffff')
    gradient.addColorStop(1.0, '#eeeeee')

    ctx.fillStyle = gradient
    ctx.fillRect(
      settings.xOffset,
      settings.yOffset,
      settings.width - settings.xOffset * 2,
      settings.height - settings.yOffset * 2
    )
  }

  const init = (canvas: HTMLCanvasElement) => {
    canvasAudiogram = canvas

    canvasAudiogram.style.width = settings.width / ratio + 'px'
    canvasAudiogram.style.height = settings.height / ratio + 'px'

    canvasAudiogram.width = settings.width
    canvasAudiogram.height = settings.height

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return
    ctx = canvasCtx

    addBackgroundGradient(ctx)
    drawGrid(ctx)

    canvasAudiogram.addEventListener('click', (e) => {
      const rect = canvasAudiogram?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX * ratio - rect.left * ratio
      const y = e.clientY * ratio - rect.top * ratio

      const xIndex = Math.round((x - settings.xOffset) / (lineWidth / 2))
      const yIndex = Math.round((y - settings.yOffset) / (lineHeight / 2))

      addPoint(xIndex, yIndex)
    })

    canvasAudiogram.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      const rect = canvasAudiogram?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX * ratio - rect.left * ratio
      const y = e.clientY * ratio - rect.top * ratio

      const xIndex = Math.round((x - settings.xOffset) / (lineWidth / 2))
      const yIndex = Math.round((y - settings.yOffset) / (lineHeight / 2))

      highlightPointToRemove(xIndex, yIndex)

      // drawPoints()
    })
  }

  // audiogram functions

  const audioType = ref<Type>(Type.Ear)
  const ear = ref<Ear>(Ear.Left)
  const transport = ref<TransportType>(TransportType.Air)
  const mask = ref(MaskType.UnMasked)
  // const soundField = ref<SoundField>(SoundField.unaided)

  const audiogram = reactive({
    ear: {
      left: {
        air: new Map(),
        bone: new Map(),
      },
      right: {
        air: new Map(),
        bone: new Map(),
      },
    },
    tonalAverage: {
      left: 0,
      right: 0,
    },
    // soundField: {
    //   unaided: new Map(),
    //   aided: new Map(),
    //   ci: new Map(),
    // },
  })

  const addPoint = (x: number, y: number) => {
    const frequency: Frequency = Object.values(FREQUENCIES)[x]
    const threshold: Threshold = Object.values(THRESHOLDS)[y]

    if (!frequency || !threshold) return

    audiogram.ear[ear.value]?.[transport.value].set(frequency.label, {
      frequency: frequency.value,
      threshold: threshold.value,
      mask: mask.value,
      transport: transport.value,
      x,
      y,
    })
    drawPoints()
    calculateTonalAverage()
  }

  const highlightPointToRemove = (x: number, y: number) => {
    const frequency: Frequency = Object.values(FREQUENCIES)[x]
    const threshold: Threshold = Object.values(THRESHOLDS)[y]
    if (!frequency || !threshold) return

    const point = audiogram.ear[ear.value]?.[transport.value].get(
      frequency.label
    )

    if (!point) return

    if (point.willRemove) {
      audiogram.ear[ear.value]?.[transport.value].delete(frequency.label)
      drawPoints()
      return
    }
    point.willRemove = true

    setTimeout(() => {
      point.willRemove = false
      drawPoints()
    }, 1000)

    drawPoints()
  }

  // const removePoint = (x: number, y: number) => {
  //   const frequency: Frequency = Object.values(FREQUENCIES)[x]
  //   const threshold: Threshold = Object.values(THRESHOLDS)[y]

  //   if (!frequency || !threshold) return

  //   audiogram.ear[ear.value]?.[transport.value].delete(frequency.label)
  //   drawPoints()
  // }

  // const removePoint = (x: number, y: number) => {
  //   const frequency: Frequencies = Object.values(Frequencies)[x]
  //   const threshold: Thresholds = Object.values(Thresholds)[y]

  //   if (type.value === Type.Ear) {
  //     const point = audiogram.ear[ear.value].get(frequency)
  //     if (!point || point.threshold !== threshold) return
  //     audiogram.ear[ear.value].delete(frequency)
  //   } else if (type.value === Type.SoundField) {
  //     const point = audiogram.soundField[soundField.value].get(frequency)
  //     if (!point || point.threshold !== threshold) return
  //     audiogram.soundField[soundField.value].delete(frequency)
  //   }
  // }

  const drawPoints = () => {
    clearPoints()

    drawConnectionLines(audiogram.ear.left.air, 'rgb(0, 0, 200)')
    drawConnectionLines(audiogram.ear.right.air, 'rgb(200, 0, 0)')
    // drawConnectionLines(audiogram.ear.left.bone, 'rgb(0, 0, 200)')
    // drawConnectionLines(audiogram.ear.right, 'rgb(200, 0, 0)')
    // drawConnectionLines(audiogram.soundField.unaided)
    // drawConnectionLines(audiogram.soundField.aided)
    // drawConnectionLines(audiogram.soundField.ci)

    audiogram.ear.left.air.forEach((point: EarPoint) => {
      drawEarPoints(`ear_left_air_${point.mask}`, point)
    })

    audiogram.ear.left.bone.forEach((point: EarPoint) => {
      drawEarPoints(`ear_left_bone_${point.mask}`, point)
    })

    audiogram.ear.right.air.forEach((point: EarPoint) => {
      drawEarPoints(`ear_right_air_${point.mask}`, point)
    })

    audiogram.ear.right.bone.forEach((point: EarPoint) => {
      drawEarPoints(`ear_right_bone_${point.mask}`, point)
    })

    // audiogram.ear.right.forEach((point) => {
    //   drawEarPoints(Ear.Right, point)
    // })

    // audiogram.soundField.unaided.forEach((point) => {
    //   drawSoundFieldPoints(point)
    // })

    // audiogram.soundField.aided.forEach((point) => {
    //   drawSoundFieldPoints(point)
    // })

    // audiogram.soundField.ci.forEach((point) => {
    //   drawSoundFieldPoints(point)
    // })
  }

  const drawEarPoints = (symbolName: string, point: EarPoint) => {
    const x = point.x * (lineWidth / 2) + settings.xOffset
    const y = point.y * (lineHeight / 2) + settings.yOffset

    const symbol = getSymbol(symbolName)
    ctx.drawImage(symbol, x - ICON_SIZE / 2, y - ICON_SIZE / 2)
    if (point.willRemove) {
      ctx.strokeStyle = 'lightcoral'
      ctx.lineWidth = 1 * ratio
      ctx.strokeRect(x - ICON_SIZE / 2, y - ICON_SIZE / 2, ICON_SIZE, ICON_SIZE)
    }

    ctx.beginPath()
  }

  const getSymbol = (symbolName: string): HTMLImageElement => {
    return AUDIOGRAM_SYMBOLS.get(symbolName) as HTMLImageElement
  }

  // const drawSoundFieldPoints = (point: SoundFieldPoint) => {
  //   ctx.fillStyle = 'rgb(0, 200, 0)'
  //   const x = point.x * (lineWidth / 2) + settings.xOffset
  //   const y = point.y * (lineHeight / 2) + settings.yOffset

  //   ctx.fillRect(x - 5, y - 5, 10, 10)
  //   ctx.beginPath()
  // }

  const drawConnectionLines = (
    points: Map<string, SoundFieldPoint>,
    color: string = 'rgb(0, 0, 0)'
  ) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 1 * ratio

    ctx.beginPath()

    const sortedPoints = [...points.values()].sort((a, b) => a.x - b.x)

    sortedPoints.forEach((point, i) => {
      const x = point.x * (lineWidth / 2) + settings.xOffset
      const y = point.y * (lineHeight / 2) + settings.yOffset

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }

  const clearPoints = () => {
    ctx.clearRect(0, 0, settings.width, settings.height)
    addBackgroundGradient(ctx)
    drawGrid(ctx)
  }

  const calculateTonalAverage = () => {
    const frequenciesToAverage = [500, 1000, 2000, 4000]

    // left
    audiogram.tonalAverage.left =
      Array.from(audiogram.ear.left.air.values())
        .filter((_) => frequenciesToAverage.includes(_.frequency))
        .map((_) => _.threshold)
        .reduce((acc, _) => acc + _, 0) / frequenciesToAverage.length

    // right
    audiogram.tonalAverage.right =
      Array.from(audiogram.ear.right.air.values())
        .filter((_) => frequenciesToAverage.includes(_.frequency))
        .map((_) => _.threshold)
        .reduce((acc, _) => acc + _, 0) / frequenciesToAverage.length
  }

  const setTransport = (type: TransportType) => {
    transport.value = type
  }

  const setMaskType = (maskType: MaskType) => {
    mask.value = maskType
  }

  const setEar = (earType: Ear) => {
    ear.value = earType
  }

  return {
    init,
    audiogram,
    // type,
    ear,
    setEar,
    setTransport,
    transport,
    setMaskType,
    mask,
    // audiogramConfig: audiogram,
    // soundField,
    // addPoint,
    // removePoint,
  }
}
