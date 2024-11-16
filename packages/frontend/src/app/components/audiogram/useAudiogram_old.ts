import { reactive, ref } from 'vue'
// import { getIcons } from './images'
// const icons = getIcons()

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

export enum SoundField {
  unaided = 'unaided',
  aided = 'aided',
  ci = 'ci',
}

export enum Ear {
  Left = 'left',
  Right = 'right',
}

export enum TransportType {
  Air = 'air',
  Bone = 'bone',
}

export enum Mask {
  UnMasked = 'unmasked',
  Masked = 'masked',
}
export enum Frequencies {
  t250 = '250',
  t375 = '375',
  t500 = '500',
  t750 = '750',
  t1k = '1k',
  t1_5k = '1.5k',
  t2k = '2k',
  t2_5k = '2.5k',
  t3k = '3k',
  t3_5k = '3.5k',
  t4k = '4k',
  t5k = '5k',
  t6k = '6k',
  t7k = '7k',
  t8k = '8k',
}

export enum Thresholds {
  t_10 = '-10',
  t_5 = '-5',
  t0 = '0',
  t5 = '5',
  t10 = '10',
  t15 = '15',
  t20 = '20',
  t25 = '25',
  t30 = '30',
  t35 = '35',
  t40 = '40',
  t45 = '45',
  t50 = '50',
  t55 = '55',
  t60 = '60',
  t65 = '65',
  t70 = '70',
  t75 = '75',
  t80 = '80',
  t85 = '85',
  t90 = '90',
  t95 = '95',
  t100 = '100',
  t105 = '105',
  t110 = '110',
  t115 = '115',
  t120 = '120',
}

export interface SoundFieldPoint {
  frequency: Frequencies
  threshold: Thresholds
  x: number
  y: number
}

export interface EarPoint extends SoundFieldPoint {
  mask?: Mask
  transport?: TransportType
}

export interface Audiogram {
  ear: {
    left: Map<Frequencies, EarPoint>
    right: Map<Frequencies, EarPoint>
  }
  soundField: {
    unaided: Map<Frequencies, SoundFieldPoint>
    aided: Map<Frequencies, SoundFieldPoint>
    ci: Map<Frequencies, SoundFieldPoint>
  }
}

export function useAudiogram(
  settings: AudiogramSettings = {
    xOffset: 40,
    yOffset: 40,
    width: 500,
    height: 500,
  }
) {
  const xLabels = ['250', '500', '1k', '2k', '3k', '4k', '6k', '8k']
  const yLabels = [
    '-10',
    '0',
    '10',
    '20',
    '30',
    '40',
    '50',
    '60',
    '70',
    '80',
    '90',
    '100',
    '110',
    '120',
  ]

  // Draw grid

  let canvasAudiogram: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  const lineWidth =
    (settings.width - settings.xOffset * 2) / (xLabels.length - 1)
  const lineHeight =
    (settings.height - settings.yOffset * 2) / (yLabels.length - 1)

  const points: Map<number, any> = new Map()

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    // Line styling
    ctx.lineWidth = 1
    ctx.strokeStyle = 'gray'

    drawHorizontalLines(ctx)
    drawVerticalLines(ctx)
    addLabels(ctx)
  }
  const drawHorizontalLines = (ctx: CanvasRenderingContext2D) => {
    yLabels.forEach((_, i) => {
      ctx.beginPath()
      const y = i * lineHeight + settings.yOffset
      ctx.moveTo(settings.xOffset, y)

      ctx.lineTo(settings.width - settings.xOffset, y)
      ctx.stroke()
    })
  }

  const drawVerticalLines = (ctx: CanvasRenderingContext2D) => {
    xLabels.forEach((_, i) => {
      ctx.beginPath()
      const x = i * lineWidth + settings.xOffset
      ctx.moveTo(x, settings.yOffset)
      ctx.lineTo(x, settings.height - settings.yOffset)
      ctx.stroke()
    })
  }

  const addLabels = (ctx: CanvasRenderingContext2D) => {
    ctx.font = '12px serif'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    xLabels.forEach((label, i) => {
      const x = i * lineWidth + settings.xOffset
      ctx.fillText(label, x, settings.yOffset / 2)
    })

    yLabels.forEach((label, i) => {
      const y = i * lineHeight + settings.yOffset
      ctx.fillText(label, settings.xOffset / 2, y)
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

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const xIndex = Math.round((x - settings.xOffset) / (lineWidth / 2))
      const yIndex = Math.round((y - settings.yOffset) / (lineHeight / 2))

      addPoint(xIndex, yIndex)

      console.log(points)
      drawPoints()
    })

    canvasAudiogram.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      const rect = canvasAudiogram?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const xIndex = Math.round((x - settings.xOffset) / (lineWidth / 2))
      const yIndex = Math.round((y - settings.yOffset) / (lineHeight / 2))

      removePoint(xIndex, yIndex)

      drawPoints()
    })
  }

  // audiogram functions

  const type = ref<Type>(Type.Ear)
  const ear = ref<Ear>(Ear.Left)
  const transport = ref<TransportType>(TransportType.Air)
  const mask = ref(false)
  const soundField = ref<SoundField>(SoundField.unaided)

  const audiogram = reactive<Audiogram>({
    ear: {
      left: new Map(),
      right: new Map(),
    },
    soundField: {
      unaided: new Map(),
      aided: new Map(),
      ci: new Map(),
    },
  })

  const addPoint = (x: number, y: number) => {
    const frequency: Frequencies = Object.values(Frequencies)[x]
    const threshold: Thresholds = Object.values(Thresholds)[y]

    if (!frequency || !threshold) return

    if (type.value === Type.Ear) {
      audiogram.ear[ear.value].set(frequency, {
        frequency,
        threshold,
        mask: mask.value ? Mask.Masked : Mask.UnMasked,
        transport: transport.value,
        x,
        y,
      })
    } else if (type.value === Type.SoundField) {
      audiogram.soundField[soundField.value].set(frequency, {
        frequency,
        threshold,
        x,
        y,
      })
    }
  }

  const removePoint = (x: number, y: number) => {
    const frequency: Frequencies = Object.values(Frequencies)[x]
    const threshold: Thresholds = Object.values(Thresholds)[y]

    if (type.value === Type.Ear) {
      const point = audiogram.ear[ear.value].get(frequency)
      if (!point || point.threshold !== threshold) return
      audiogram.ear[ear.value].delete(frequency)
    } else if (type.value === Type.SoundField) {
      const point = audiogram.soundField[soundField.value].get(frequency)
      if (!point || point.threshold !== threshold) return
      audiogram.soundField[soundField.value].delete(frequency)
    }
  }

  const drawPoints = () => {
    clearPoints()

    drawConnectionLines(audiogram.ear.left, 'rgb(0, 0, 200)')
    drawConnectionLines(audiogram.ear.right, 'rgb(200, 0, 0)')
    drawConnectionLines(audiogram.soundField.unaided)
    drawConnectionLines(audiogram.soundField.aided)
    drawConnectionLines(audiogram.soundField.ci)

    audiogram.ear.left.forEach((point) => {
      drawEarPoints(Ear.Left, point)
    })

    audiogram.ear.right.forEach((point) => {
      drawEarPoints(Ear.Right, point)
    })

    audiogram.soundField.unaided.forEach((point) => {
      drawSoundFieldPoints(point)
    })

    audiogram.soundField.aided.forEach((point) => {
      drawSoundFieldPoints(point)
    })

    audiogram.soundField.ci.forEach((point) => {
      drawSoundFieldPoints(point)
    })
  }

  const drawEarPoints = (ear: Ear, point: EarPoint) => {
    ctx.fillStyle = ear === Ear.Left ? 'rgb(0, 0, 200)' : 'rgb(200, 0, 0)'
    ctx.font = '32px serif'
    const x = point.x * (lineWidth / 2) + settings.xOffset
    const y = point.y * (lineHeight / 2) + settings.yOffset

    const symbol = getEarPointSymbol(ear, point)
    ctx.drawImage(symbol, x - 10, y - 10)

    ctx.beginPath()
  }

  let symbol = new Image()
  symbol.width = 20
  symbol.height = 20

  const getEarPointSymbol = (ear: Ear, point: EarPoint): HTMLImageElement => {
    console.log(ear, point)

    return symbol
    // icons.left.air.unmasked.response
  }

  const drawSoundFieldPoints = (point: SoundFieldPoint) => {
    ctx.fillStyle = 'rgb(0, 200, 0)'
    const x = point.x * (lineWidth / 2) + settings.xOffset
    const y = point.y * (lineHeight / 2) + settings.yOffset

    ctx.fillRect(x - 5, y - 5, 10, 10)
    ctx.beginPath()
  }

  const drawConnectionLines = (
    points: Map<Frequencies, SoundFieldPoint>,
    color: string = 'rgb(0, 0, 0)'
  ) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2

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

  return {
    init,
    type,
    ear,
    transport,
    mask,
    audiogramConfig: audiogram,
    soundField,
    addPoint,
    removePoint,
  }
}
