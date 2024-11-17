const svg = (size: number) =>
  `
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="${size}"
    height="${size}"
    stroke="rgb(200, 0, 0)"
    fill="none"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
>
     <path d="M6 2h-4 v28 h4" />
</svg>
    `

export function getRightBoneMaskedIcon(size: number) {
  const image = new Image()
  image.src = `data:image/svg+xml,${encodeURIComponent(svg(size))}`
  image.width = size
  image.height = size
  return image
}
