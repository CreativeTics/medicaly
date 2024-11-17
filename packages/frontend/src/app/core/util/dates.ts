import dayjs from 'dayjs'

export function formatDate(date: string, time: boolean = false): string {
  return dayjs(date).format(`DD/MM/YYYY${time ? ' HH:mm' : ''}`)
}

export function calculateAgeFromBirthDate(birthDate: string): {
  years: number
  months: number
  days: number
} {
  console.log('calculateAgeFromBirthDate', { birthDate })
  const now = dayjs()
  const birth = dayjs(birthDate)
  const years = now.diff(birth, 'year')
  const months = now.diff(birth, 'month') % 12
  const days = now.diff(birth, 'day') % 30
  return { years, months, days }
}
