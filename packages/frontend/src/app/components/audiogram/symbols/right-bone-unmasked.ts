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
       <path d="M6 30l-4 -14l4 -14" />
    </svg>  
    `

export function getRightBoneUnmaskedIcon(size: number) {
  const image = new Image()
  image.src = `data:image/svg+xml,${encodeURIComponent(svg(size))}`
  image.width = size
  image.height = size
  return image
}
