const svg = (size: number) =>
  `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      stroke="rgb(200, 0, 0)"
      viewBox="0 0 32 32"
      fill="none"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
       <polygon points="16,6 26,26 6,26" />
    </svg>
    
    
    `

export function getRightAirMaskedIcon(size: number) {
  const image = new Image()
  image.src = `data:image/svg+xml,${encodeURIComponent(svg(size))}`
  image.width = size
  image.height = size
  return image
}
