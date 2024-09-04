import EjsService from '../services/ejs.service'
import { couchHttp } from '../util/http'

import { PrintPdfDto, GotenbergService } from '../services/gotenberg.service'

export class GenerateCertificateController {
  async execute(
    orderId: string,
    serviceId: string,
    examId: string
  ): Promise<{
    name: string
    mimeType: string
    data: Buffer
  }> {
    console.log(
      'Received request to generate certificate',
      orderId,
      serviceId,
      examId
    )

    try {
      const examConfig = await this.getExamConfig(examId)

      if (!examConfig.requireCertificate || !examConfig.certificateTemplate) {
        console.log('Certificate not configured for this exam')
        return null
      }

      // 1. Get  data
      const orderData = await this.getOrderData(orderId)
      console.log('load orderData')

      const contractData = await this.getContractData(orderData?.contract)
      console.log('load contractData')

      const patientData = await this.getPatientData(orderData?.patientDataId)
      console.log('load patientData')

      const annotations = await this.getAnnotations(orderId)
      console.log('load annotations', annotations)

      const annotation = annotations.find(
        (annotation) =>
          annotation.examId === examId && annotation.serviceId === serviceId
      )

      if (!annotation) {
        console.log('Annotation not found for this exam')
        return null
      }

      // validate if attachment is  already created and return PDF
      if (annotation.attachment_certificate) {
        const { data: certificate, name } = await this.getAttachment(
          annotation.attachment_certificate
        )
        return {
          mimeType: 'application/pdf',
          name,
          data: certificate,
        }
      }

      // 2. render templates
      const templates = await this.renderTemplates({
        templateId: examConfig.certificateTemplate,
        order: orderData,
        contract: contractData,
        patient: patientData,
        allAnnotations: annotations,
        annotation,
      })

      console.log('templates')
      // 3. Create
      const certificate = await this.createPdf(templates)
      const certificateName = `${orderData.code}_${examConfig.code}_certificate.pdf`
      console.log('certificate')

      //4. Save  in files database

      await this.saveCertificateAttachmentInAnnotation(
        patientData.id,
        annotation._id,
        {
          data: certificate,
          name: certificateName,
        }
      )

      // 5. Return file
      return {
        mimeType: 'application/pdf',
        name: certificateName,
        data: certificate,
      }
    } catch (error) {
      console.log('Error generating certificate', error)
    }
    return null
  }

  async getExamConfig(examId: string): Promise<{
    code: string
    requireCertificate: boolean
    certificateTemplate: string
  }> {
    const response = await couchHttp.get(`/medical/${examId}`)

    if (response.status !== 200) {
      throw new Error('Exam not found')
    }

    return {
      code: response.data.code,
      requireCertificate: response.data.requireCertificate,
      certificateTemplate: response.data.certificateTemplate,
    }
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

    return response.data.docs
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
    allAnnotations: any
    annotation: any
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

  async saveCertificateAttachmentInAnnotation(
    patientId: string,
    annotationId: string,
    certificate: {
      data: Buffer
      name: string
    }
  ): Promise<void> {
    // save pdf in files database

    const response = await couchHttp.post(`/files/`, {
      docType: 'files',
      bucket: 'patients',
      folder: `${patientId}/certificates/`,
      name: certificate.name,
      _attachments: {
        'certificate.pdf': {
          content_type: 'application/pdf',
          data: certificate.data.toString('base64'),
        },
      },
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    })

    // save file id in annotation

    const annotationResponse = await couchHttp.get(`/medical/${annotationId}`)
    if (annotationResponse.status !== 200) {
      throw new Error('Annotation not found')
    }

    const annotation = annotationResponse.data
    annotation.attachment_certificate = response.data.id

    const updateResponse = await couchHttp.put(
      `/medical/${annotationId}`,
      annotation
    )

    if (updateResponse.status !== 201) {
      throw new Error('Error saving certificate in annotation')
    }
  }

  async getAttachment(
    attachmentId: string
  ): Promise<{ data: Buffer; name: string }> {
    const response = await couchHttp.get(`/files/${attachmentId}`)

    if (response.status !== 200) {
      throw new Error('File not found')
    }

    const attachment = await couchHttp.get(
      `/files/${attachmentId}/certificate.pdf`,
      {
        responseType: 'arraybuffer',
      }
    )

    if (attachment.status !== 200) {
      throw new Error('Attachment not found')
    }

    return {
      name: response.data.name,
      data: attachment.data,
    }
  }
}
