export interface Threshold {
  value: number
  label: string
  show: boolean
}

export const THRESHOLDS: Record<string, Threshold> = {
  t_10: {
    value: -10,
    label: '-10',
    show: true,
  },
  t_5: {
    value: -5,
    label: '-5',
    show: false,
  },
  t0: {
    value: 0,
    label: '0',
    show: true,
  },
  t5: {
    value: 5,
    label: '5',
    show: false,
  },
  t10: {
    value: 10,
    label: '10',
    show: true,
  },
  t15: {
    value: 15,
    label: '15',
    show: false,
  },
  t20: {
    value: 20,
    label: '20',
    show: true,
  },
  t25: {
    value: 25,
    label: '25',
    show: false,
  },
  t30: {
    value: 30,
    label: '30',
    show: true,
  },
  t35: {
    value: 35,
    label: '35',
    show: false,
  },
  t40: {
    value: 40,
    label: '40',
    show: true,
  },
  t45: {
    value: 45,
    label: '45',
    show: false,
  },
  t50: {
    value: 50,
    label: '50',
    show: true,
  },
  t55: {
    value: 55,
    label: '55',
    show: false,
  },
  t60: {
    value: 60,
    label: '60',
    show: true,
  },
  t65: {
    value: 65,
    label: '65',
    show: false,
  },
  t70: {
    value: 70,
    label: '70',
    show: true,
  },
  t75: {
    value: 75,
    label: '75',
    show: false,
  },
  t80: {
    value: 80,
    label: '80',
    show: true,
  },
  t85: {
    value: 85,
    label: '85',
    show: false,
  },
  t90: {
    value: 90,
    label: '90',
    show: true,
  },
  t95: {
    value: 95,
    label: '95',
    show: false,
  },
  t100: {
    value: 100,
    label: '100',
    show: true,
  },
  t105: {
    value: 105,
    label: '105',
    show: false,
  },
  t110: {
    value: 110,
    label: '110',
    show: true,
  },
  t115: {
    value: 115,
    label: '115',
    show: false,
  },
  t120: {
    value: 120,
    label: '120',
    show: true,
  },
}
