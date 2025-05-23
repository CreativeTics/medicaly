export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  const clonedObj: Record<string, any> = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone((obj as Record<string, any>)[key])
    }
  }

  return clonedObj as T
}

export function getNestedValue(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object' || !path) {
    return undefined
  }
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}
