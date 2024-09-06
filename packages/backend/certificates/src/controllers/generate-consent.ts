import EjsService from '../services/ejs.service'
import { couchHttp } from '../util/http'

import { PrintPdfDto, GotenbergService } from '../services/gotenberg.service'

export class GenerateConsentController {
  async execute(
    orderId: string,
    consentTemplateId: string
  ): Promise<{
    name: string
    mimeType: string
    data: Buffer
  }> {
    console.log(
      'Received request to generate consent for order',
      orderId,
      consentTemplateId
    )

    try {
      // 1. Get  data
      const orderData = await this.getOrderData(orderId)
      console.log('load orderData')

      const contractData = await this.getContractData(orderData?.contract)
      console.log('load contractData')

      const patientData = await this.getPatientData(orderData?.patientDataId)
      console.log('load patientData')

      // TODO get finalize order doctor data

      // 2. render templates
      const templates = await this.renderTemplates({
        templateId: consentTemplateId,
        order: orderData,
        contract: contractData,
        patient: patientData,
      })

      console.log('templates')
      // 3. Create
      const consent = await this.createPdf(templates)
      const consentName = `${orderData.code}_consent.pdf`

      // Return file
      return {
        mimeType: 'application/pdf',
        name: consentName,
        data: consent,
      }
    } catch (error) {
      console.log('Error generating consent', error)
    }
    return null
  }

  async getOrderData(orderId: string) {
    const response = await couchHttp.get(`/general/${orderId}`)

    if (response.status !== 200) {
      throw new Error('Order not found')
    }

    return {
      id: response.data._id,
      ...response.data,
    }
  }

  async getContractData(contractId: string) {
    const response = await couchHttp.get(`/general/${contractId}`)

    if (response.status !== 200) {
      throw new Error('Contract not found')
    }

    return {
      id: response.data._id,
      ...response.data,
    }
  }

  async getPatientData(patientDataId: string) {
    console.log('patientDataId', patientDataId)
    const response = await couchHttp.get(`/medical/${patientDataId}`)

    if (response.status !== 200) {
      throw new Error('Patient not found')
    }
    console.log('patientId', response.data.patientId)

    // get patient
    const patient = await couchHttp.get(`/medical/${response.data.patientId}`)

    return {
      id: patient.data._id,
      ...patient.data,
      ...response.data,
    }
  }

  async createPdf(templates: PrintPdfDto): Promise<Buffer> {
    const gotenbergService = new GotenbergService()

    const pdf = (await gotenbergService.build(templates, {
      buffer: true,
      waitDelay: '1s',
    })) as Buffer
    return pdf
  }

  async renderTemplates(data: {
    templateId: string
    order: any
    patient: any
    contract: any
  }): Promise<PrintPdfDto> {
    const templates = await this.getTemplates(data.templateId)
    const ejsService = new EjsService()
    return {
      header: await ejsService.renderFile(templates.header, data),
      index: await ejsService.renderFile(templates.index, data),
      footer: await ejsService.renderFile(templates.footer, data),
      properties: templates.properties,
    }
  }

  async getTemplates(templateId: string): Promise<{
    header: string
    index: string
    footer: string
    properties?: any
  }> {
    const response = await couchHttp.get(`/general/${templateId}`)

    if (response.status !== 200) {
      throw new Error('Template not found')
    }

    const template = response.data

    return {
      header: template.header,
      index: template.body,
      footer: template.footer,
      properties: template.props,
    }
  }
}
