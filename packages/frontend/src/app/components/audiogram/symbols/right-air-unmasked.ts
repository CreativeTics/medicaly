const svg = (size: number) =>
  `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${size}"
    height="${size}"
    viewBox="0 0 32 32"
    fill="none"
    stroke="rgb(200, 0, 0)"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
    >
    <circle cx="16" cy="16" r="10" />
    </svg>
    
    `

export function getRightAirUnmaskedIcon(size: number) {
  const image = new Image()
  image.src = `data:image/svg+xml,${encodeURIComponent(svg(size))}`
  image.width = size
  image.height = size
  return image
}
