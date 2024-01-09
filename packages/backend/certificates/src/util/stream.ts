import { Readable } from 'stream'

export function streamToBase64(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')))
  })
}

export function stringToStream(str: string): NodeJS.ReadableStream {
  return Readable.from(str)
}
