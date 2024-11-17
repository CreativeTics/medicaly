export interface Frequency {
  value: number
  label: string
  show: boolean
}

export const FREQUENCIES: Record<string, Frequency> = {
  t250: {
    value: 250,
    label: '250',
    show: true,
  },
  t375: {
    value: 375,
    label: '375',
    show: false,
  },
  t500: {
    value: 500,
    label: '500',
    show: true,
  },
  t750: {
    value: 750,
    label: '750',
    show: false,
  },
  t1k: {
    value: 1000,
    label: '1k',
    show: true,
  },
  t1_5k: {
    value: 1500,
    label: '1.5k',
    show: false,
  },
  t2k: {
    value: 2000,
    label: '2k',
    show: true,
  },
  t2_5k: {
    value: 2500,
    label: '2.5k',
    show: false,
  },
  t3k: {
    value: 3000,
    label: '3k',
    show: true,
  },
  t3_5k: {
    value: 3500,
    label: '3.5k',
    show: false,
  },
  t4k: {
    value: 4000,
    label: '4k',
    show: true,
  },
  t5k: {
    value: 5000,
    label: '5k',
    show: false,
  },
  t6k: {
    value: 6000,
    label: '6k',
    show: true,
  },
  t7k: {
    value: 7000,
    label: '7k',
    show: false,
  },
  t8k: {
    value: 8000,
    label: '8k',
    show: true,
  },
}
