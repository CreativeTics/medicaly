const svg = (size: number) =>
  `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      stroke="rgb(0, 0, 200)"
      viewBox="0 0 32 32"
      fill="none"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
       <path d="M26 2l4 14l-4 14" />
    </svg>  
    `

export function getLeftBoneUnmaskedIcon(size: number) {
  const image = new Image()
  image.src = `data:image/svg+xml,${encodeURIComponent(svg(size))}`
  image.width = size
  image.height = size
  return image
}
