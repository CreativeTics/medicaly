const fs = require('fs')
const path = require('path')

// Ruta del archivo de entrada
const inputFilePath = './basic/icons/index.ts' // Asegúrate de cambiar esto a la ruta de tu archivo de entrada
// Ruta del archivo de salida
const outputFilePath = './basic/icons/index.ts' // Cambia esto si lo necesitas

// Lee el archivo de entrada
fs.readFile(inputFilePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error leyendo el archivo:', err)
    return
  }

  // Separa las líneas del archivo
  const lines = data.split('\n')

  // Transforma las líneas
  const transformedLines = lines.map((line) => {
    // export const ADIcon = defineAsyncComponent(() => import('./ADIcon.vue'))
    const regex = /export { default as (\w+) } from '(\.\/[a-zA-Z0-9\-\.]+)'/
    const match = line.match(regex)

    if (match) {
      const componentName = match[1]
      const componentPath = match[2]
      return `export const ${componentName} = defineAsyncComponent(() => import('${componentPath}'))`
    }

    // Si no se encuentra un match, devuelve la línea original
    return line
  })

  // Escribe el resultado en el archivo de salida
  const transformedContent = transformedLines.join('\n')

  fs.writeFile(outputFilePath, transformedContent, 'utf-8', (err) => {
    if (err) {
      console.error('Error escribiendo el archivo:', err)
    } else {
      console.log('Archivo transformado y guardado como', outputFilePath)
    }
  })
})
