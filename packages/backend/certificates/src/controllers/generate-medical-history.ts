import EjsService from '../services/ejs.service'
import { couchHttp } from '../util/http'

import { PrintPdfDto, GotenbergService } from '../services/gotenberg.service'
import { readFileSync } from 'fs'

export class GenerateMedicalHistoryController {
  async execute(
    orderId: string,
    code: string = 'medical-history'
  ): Promise<{
    id: string
  }> {
    console.log('Received request to generate certificate', orderId, code)

    try {
      // 1. Get  data
      const orderData = await this.getOrderData(orderId)
      console.log('orderData')

      const contractData = await this.getContractData(orderData?.contract)
      console.log('contractData')

      const patientData = await this.getPatientData(orderData?.patientDataId)
      console.log('patientData')

      const annotations = await this.getAnnotations(orderId)
      console.log('annotations', annotations)

      // 2. render templates
      const templates = await this.renderTemplates({
        code,
        order: orderData,
        contract: contractData,
        patient: patientData,
        annotations,
      })
      console.log('templates')

      // 3. Create
      const certificate = await this.createPdf(templates)
      console.log('certificate')

      //4. Save  in files database

      const id = await this.savePdf(orderId, certificate)

      // 5. Return file id
      return {
        id,
      }
    } catch (error) {
      console.log('Error generating certificate', error)
    }
    return null
  }

  async getRenderedHtmlMedicalHistory(orderId: string): Promise<string> {
    const orderData = await this.getOrderData(orderId)
    console.log('orderData')
    const annotationsOrder: string[] = orderData.services
      .map((service) => service.exams)
      .flat()

    const contractData = await this.getContractData(orderData?.contract)
    console.log('contractData')

    const patientData = await this.getPatientData(orderData?.patientDataId)
    console.log('patientData')

    const annotations: any[] = await this.getAnnotations(orderId)
    // sort
    annotations.sort((a, b) => {
      return (
        annotationsOrder.indexOf(a.examId) - annotationsOrder.indexOf(b.examId)
      )
    })

    console.log('annotations', annotations)

    const ejsService = new EjsService()

    const templates = await this.getTemplates('MEDICAL-HISTORY')
    // packages/backend/certificates/templates/medical-history-body.ejs
    const file = readFileSync(
      `${__dirname}/../../templates/medical-history-body.ejs`,
      'utf8'
    )

    const transpiledHtml = await ejsService.renderFile(file, {
      order: orderData,
      contract: contractData,
      patient: patientData,
      annotations,
    })

    return transpiledHtml
  }

  async getOrderData(orderId: string) {
    const response = await couchHttp.get(`/general/${orderId}`)

    if (response.status !== 200) {
      throw new Error('Order not found')
    }

    return response.data
  }

  async getContractData(contractId: string) {
    const response = await couchHttp.get(`/general/${contractId}`)

    if (response.status !== 200) {
      throw new Error('Contract not found')
    }

    return response.data
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
      ...patient.data,
      ...response.data,
    }
  }

  async getAnnotations(orderId: string) {
    const response = await couchHttp.post(`/medical/_find`, {
      selector: {
        doctype: 'annotations',
        orderId,
      },
    })

    if (response.status !== 200) {
      throw new Error('Annotations not found')
    }

    // get exam for each annotation
    for (const annotation of response.data.docs) {
      const examResponse = await couchHttp.get(`/medical/${annotation.examId}`)

      if (examResponse.status !== 200) {
        throw new Error('Exam not found')
      }
      const form = JSON.parse(examResponse.data.form) // form is a string
      annotation.exam = {
        type: examResponse.data.type,
        name: examResponse.data.name,
        code: examResponse.data.code,
        version: examResponse.data.version,
        form,
      }
    }

    return response.data.docs
  }

  async createPdf(templates: PrintPdfDto): Promise<string> {
    const gotenbergService = new GotenbergService()

    const pdf = await gotenbergService.build(templates)

    return pdf
  }

  async renderTemplates(data: {
    code: string
    order: any
    patient: any
    contract: any
    annotations: any
  }): Promise<PrintPdfDto> {
    const templates = await this.getTemplates(data.code)
    const ejsService = new EjsService()
    return {
      header: await ejsService.renderFile(templates.header, data),
      index: await ejsService.renderFile(templates.index, data),
      footer: await ejsService.renderFile(templates.footer, data),
      properties: templates.properties,
    }
  }

  async getTemplates(code: string): Promise<{
    header: string
    index: string
    footer: string
    properties?: any
  }> {
    // find template in database by code
    const response = await couchHttp.post(`/general/_find`, {
      selector: {
        doctype: 'templates',
        code,
      },
      fields: ['_id', 'code', 'header', 'body', 'footer', 'props'],
    })
    if (response.status !== 200) {
      throw new Error('Template not found')
    }

    const template = response.data.docs[0]

    return {
      header: template.header,
      index: template.body,
      footer: template.footer,
      properties: template.props,
    }
  }

  async savePdf(orderId: string, base64Certificate: string): Promise<string> {
    // save pdf in files database

    const response = await couchHttp.post(`/files/`, {
      docType: 'files',
      type: 'certificates',
      orderId,
      _attachments: {
        'certificate.pdf': {
          content_type: 'application/pdf',
          data: base64Certificate,
        },
      },
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    })

    // return file id
    return response.data.id
  }
}
