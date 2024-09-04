import EjsService from '../services/ejs.service'
import { couchHttp } from '../util/http'

export class GenerateAnnotationViewController {
  async execute(
    orderId: string,
    annotationId: string,
    token: string
  ): Promise<string> {
    const orderData = await this.getOrderData(orderId)

    const contractData = await this.getContractData(orderData?.contract)

    const patientData = await this.getPatientData(orderData?.patientDataId)

    const annotations: any[] = await this.getAnnotations(orderId)

    // sort
    const annotationsOrder: string[] = orderData.services
      .map((service) => service.exams)
      .flat()

    annotations.sort((a, b) => {
      return (
        annotationsOrder.indexOf(a.examId) - annotationsOrder.indexOf(b.examId)
      )
    })

    // get doctor finalize the order
    const doctor = {}

    const ejsService = new EjsService()

    const template = await this.getMedicalHistoryTemplate()

    const transpiledHtml = await ejsService.renderFile(template, {
      token,
      order: orderData,
      contract: contractData,
      patient: patientData,
      allAnnotations: annotations,
      annotation: annotations.find((a) => a._id === annotationId),
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

  async getMedicalHistoryTemplate(): Promise<string> {
    // find template in database by code
    const response = await couchHttp.post(`/general/_find`, {
      selector: {
        doctype: 'templates',
        code: 'MEDICAL-ANNOTATION',
      },
      fields: ['_id', 'body'],
    })
    if (response.status !== 200) {
      throw new Error('Template not found')
    }

    return response.data.docs[0].body
  }
}
