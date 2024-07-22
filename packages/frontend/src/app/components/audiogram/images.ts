const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.34786 0.334967L2.43872 0.418419L10 7.97929L17.5613 0.418419C18.1192 -0.139473 19.0237 -0.139473 19.5816 0.418419C20.1101 0.946948 20.1379 1.78658 19.665 2.34786L19.5816 2.43872L12.0207 10L19.5816 17.5613C20.1395 18.1192 20.1395 19.0237 19.5816 19.5816C19.0531 20.1101 18.2134 20.1379 17.6521 19.665L17.5613 19.5816L10 12.0207L2.43872 19.5816C1.88083 20.1395 0.976311 20.1395 0.418419 19.5816C-0.11011 19.0531 -0.137928 18.2134 0.334967 17.6521L0.418419 17.5613L7.97929 10L0.418419 2.43872C-0.139473 1.88083 -0.139473 0.976311 0.418419 0.418419C0.946948 -0.11011 1.78658 -0.137928 2.34786 0.334967Z" fill="#0061FF"/>
</svg>`

const image = new Image()
image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`
image.width = 20
image.height = 20

export function getIcons() {
  return {
    left: {
      air: {
        unmasked: {
          response: image,
          noResponse: image,
        },
        masked: {
          response: image,
          noResponse: image,
        },
      },
      bone: {
        unmasked: {
          response: image,
          noResponse: image,
        },
        masked: {
          response: image,
          noResponse: image,
        },
      },
    },
  }
}
