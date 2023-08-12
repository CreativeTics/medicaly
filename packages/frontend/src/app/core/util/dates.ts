import dayjs from "dayjs";

export function formatDate(date: string, time: boolean = false): string {
  return dayjs(date).format(`DD/MM/YYYY${time ? " HH:mm" : ""}`);
}
