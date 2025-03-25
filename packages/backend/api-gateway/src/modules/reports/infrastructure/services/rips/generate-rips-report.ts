import dayjs from 'dayjs'
import { couchHttp } from '../../../../../shared/infrastructure/databases/util/http'
import { RipsConsulta, RipsTransaction, RipsUsuario } from './types'

export async function generateRipsReport(
  invoiceId: string
): Promise<{ rips: RipsTransaction; name: string }> {
  // Do something with the response
  const invoice = await getInvoice(invoiceId)

  const report: RipsTransaction = {
    numDocumentoIdObligado: invoice.subsidiaryFiscalId,
    numFactura: invoice.invoiceNumber,
    tipoNota: null,
    numNota: null,
    usuarios: [],
  }

  // invoice.orders.forEach((order) => {

  await Promise.all(
    invoice.orders.map(async (order, index) => {
      // setInvoiceToOrder(order.id, invoice.id)
      report.usuarios.push({
        ...(await getUserFromOrder(order.id)),
        consecutivo: index + 1,
      })
    })
  )

  return { rips: report, name: `rips-${invoice.invoiceNumber}` }
}

async function getUserFromOrder(orderId: string): Promise<RipsUsuario> {
  const order = await getOrder(orderId)
  const patient = await getPatient(order.patientId, order.patientDataId)

  return {
    tipoDocumentoldentificacion: patient.documentType,
    numDocumentoIdentificacion: patient.documentNumber,
    tipoUsuario: '12', // 12: particulares
    fechaNacimiento: patient.birthDate,
    codSexo: patient.biologicalSex == 'Masculino' ? 'M' : 'F',
    codPaisResidencia: '170', // Colombia
    codMunicipioResidencia: (await getCity(patient.residenceCity))?.code,
    codZonaTerritorialResidencia:
      patient.residenceType == 'Rural' ? '01' : '02',
    incapacidad: 'NO', // Se solicita de esta manera
    consecutivo: 0, // se calcula en el map
    codPaisOrigen: (await getCity(patient.precedenceCity))?.country,
    servicios: {
      consultas: [await getMedicalConsultationFromOrder(order)],
      procedimientos: [],
      urgencias: [],
      hospitalizacion: [],
      recienNacidos: [],
      medicamentos: [],
      otrosServicios: [],
    },
  }
}

async function getMedicalConsultationFromOrder(
  order: any
): Promise<RipsConsulta> {
  //     fechaInicioAtencion: string
  //   numAutorizacion: string | null
  //   codConsulta: string
  //   modalidadGrupoServicioTecSal: string
  //   grupoServicios: string
  //   codServicio: number
  //   finalidadTecnologiaSalud: string
  //   causaMotivoAtencion: string
  //   codDiagnosticoPrincipal: string
  //   codDiagnosticoRelacionado1: string | null
  //   codDiagnosticoRelacionado2: string | null
  //   codDiagnosticoRelacionado3: string | null
  //   tipoDiagnosticoPrincipal: string
  //   tipoDocumentoIdentificacion: string
  //   numDocumentoIdentificacion: string
  //   vrServicio: number
  //   conceptoRecaudo: string
  //   valorPagoModerador: number
  //   numFEVPagoModerador: string | null
  //   consecutivo: number
  const admissionDate = order.orderCycle.find(
    (cycle: any) => cycle.type === 'admission'
  )?.at

  const annotation = await getDiagnosisFormOrder(order)

  return {
    codPrestador: '254300276001', // TODO: get from subsidiary
    fechaInicioAtencion: dayjs(admissionDate).format('YYYY-MM-DD HH:mm'),
    numAutorizacion: null,
    codConsulta: 'PENDIENTE DEFINIR',
    modalidadGrupoServicioTecSal: '01', // TODO: get from subsidiary  01: Intramural
    grupoServicios: '01', // Consulta externa
    codServicio: 1, // TODO: get from subsidiary  328  - Medicina General, 407 - Medicina laboral
    finalidadTecnologiaSalud: '15', // 15: Diagnóstico, 16: Tratamiento
    causaMotivoAtencion: '38', // 38: Enfermedad general
    codDiagnosticoPrincipal: annotation.diagnosis[0] ?? 'Z000', // Z000: No aplica
    codDiagnosticoRelacionado1: annotation.diagnosis[1] ?? null,
    codDiagnosticoRelacionado2: annotation.diagnosis[2] ?? null,
    codDiagnosticoRelacionado3: annotation.diagnosis[3] ?? null,
    tipoDiagnosticoPrincipal: '01', // TODO: Validar
    tipoDocumentoIdentificacion: 'CC',
    numDocumentoIdentificacion: order?.finalizedBy?.document ?? '',
    vrServicio: null,
    conceptoRecaudo: '05', // 05: No aplica
    valorPagoModerador: null,
    numFEVPagoModerador: null,
    consecutivo: 1, // es 1 consulta por orden
  }
}

async function getInvoice(id: string) {
  const invoiceResponse = await couchHttp.get(`/billing/${id}`)
  if (invoiceResponse.status !== 200) {
    return
  }
  return invoiceResponse.data
}

async function getOrder(id: string) {
  const orderResponse = await couchHttp.get(`/general/${id}`)
  if (orderResponse.status !== 200) {
    return
  }
  return orderResponse.data
}

async function getPatient(id: string, patientDataId: string) {
  const patientResponse = await couchHttp.get(`/medical/${id}`)
  if (patientResponse.status !== 200) {
    return
  }
  const patientRow = patientResponse.data

  const patientDataResponse = await couchHttp.get(`/medical/${patientDataId}`)
  if (patientDataResponse.status !== 200) {
    return
  }
  const patientData = patientDataResponse.data

  return {
    ...patientRow,
    ...patientData,
  }
}

async function getCity(id: string) {
  const cityResponse = await couchHttp.get(`/general/${id}`)
  if (cityResponse.status !== 200) {
    return
  }
  return {
    code: cityResponse.data.code,
    country: cityResponse.data.countryCode,
  }
}

async function getDiagnosisFormOrder(order: any) {
  const EXAM_MEDICAL_ID = 'e6ce571a03dba5b38099b6852d000762'

  let annotationId = ''

  order.services.forEach((service: any) => {
    if (annotationId) return

    annotationId = service.annotations.find((annotationId: any) =>
      annotationId.includes(EXAM_MEDICAL_ID)
    )
  })

  if (!annotationId) {
    return {
      diagnosis: [],
    }
  }
  const diagnosisResponse = await couchHttp.get(`/medical/${annotationId}`)
  if (diagnosisResponse.status !== 200) {
    return
  }
  return {
    diagnosis: diagnosisResponse.data.diagnosis as string[],
  }
}
