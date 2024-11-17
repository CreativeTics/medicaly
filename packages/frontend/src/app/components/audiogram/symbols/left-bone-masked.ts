const svg = (size: number) =>
  `
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="${size}"
    height="${size}"
    stroke="rgb(0, 0, 200)"
    fill="none"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
>
     <path d="M26 2h4 v28 h-4" />
</svg>
    `

export function getLeftBoneMaskedIcon(size: number) {
  const image = new Image()
  image.src = `data:image/svg+xml,${encodeURIComponent(svg(size))}`
  image.width = size
  image.height = size
  return image
}
