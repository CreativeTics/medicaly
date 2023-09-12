const image = new Image()
image.src = `data:image/png;base64,Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9InV0Zi04Ij8+CjwhRE9DVFlQRSBodG1sIFBVQkxJQyAiLS8vVzNDLy9EVEQgWEhUTUwgMS4wIFN0cmljdC8vRU4iCiAiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwxL0RURC94aHRtbDEtc3RyaWN0LmR0ZCI+CjxodG1sPgogIDxoZWFkPgogICAgPHRpdGxlPjUwMyBmaXJzdCBieXRlIHRpbWVvdXQ8L3RpdGxlPgogIDwvaGVhZD4KICA8Ym9keT4KICAgIDxoMT5FcnJvciA1MDMgZmlyc3QgYnl0ZSB0aW1lb3V0PC9oMT4KICAgIDxwPmZpcnN0IGJ5dGUgdGltZW91dDwvcD4KICAgIDxoMz5FcnJvciA1NDExMzwvaDM+CiAgICA8cD5EZXRhaWxzOiBjYWNoZS1ib2cyMjYwMDIzLUJPRyAxNjkzODg3ODkxIDMxNTk4NzExNDwvcD4KICAgIDxocj4KICAgIDxwPlZhcm5pc2ggY2FjaGUgc2VydmVyPC9wPgogIDwvYm9keT4KPC9odG1sPgo=`

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
