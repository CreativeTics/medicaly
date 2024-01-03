import {
  pipe,
  gotenberg,
  convert,
  html,
  please,
  adjust,
  set,
  merge,
} from 'gotenberg-js-client'
import constants from '../config'

export interface PrintPdfDto {
  index: string
  header: string
  footer: string
}

export class GotenbergService {
  async build(data: PrintPdfDto, params: any): Promise<NodeJS.ReadableStream> {
    const toPDF = pipe(
      gotenberg(constants().API_GOTENBERG),
      convert,
      html,
      adjust({
        fields: {
          printBackground: true,
          marginTop: 1,
          marginBottom: 1,
          marginLeft: 0.2,
          marginRight: 0.2,
          ...params,
        } as any,
      }),
      set({
        waitTimeout: 1000,
        googleChromeRpccBufferSize: 104857600,
      }),
      please
    )

    return await toPDF({
      'index.html': data.index,
      'header.html': data.header,
      'footer.html': data.footer,
    })
  }
}
