const svg = (size: number) =>
  `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${size}"
    height="${size}"
    viewBox="0 0 32 32"
    fill="none"
    stroke="rgb(0, 0, 200)"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
    >
      <path d="M24 8l-16 16" />
      <path d="M8 8l16 16" />
    </svg>`

export function getLeftAirUnmaskedIcon(size: number) {
  const image = new Image()
  image.src = `data:image/svg+xml,${encodeURIComponent(svg(size))}`
  image.width = size
  image.height = size
  return image
}
