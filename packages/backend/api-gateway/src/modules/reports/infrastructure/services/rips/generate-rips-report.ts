import { couchHttp } from '../../../../../shared/infrastructure/databases/util/http'
import { RipsConsulta, RipsTransaction, RipsUsuario } from './types'

export async function generateRipsReport(
  invoiceId: string
): Promise<{ rips: RipsTransaction; name: string }> {
  // Do something with the response
  const invoice = await getInvoice(invoiceId)

  const report: RipsTransaction = {
    numDocumentoIdObligado: '123465789',
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

  return { rips: report, name: 'rips' }
}

async function getUserFromOrder(orderId: string): Promise<RipsUsuario> {
  const order = await getOrder(orderId)
  const patient = await getPatient(order.patientId, order.patientDataId)

  return {
    tipoDocumentoldentificacion: patient.documentType,
    numDocumentoIdentificacion: patient.documentNumber,
    tipoUsuario: '01',
    fechaNacimiento: patient.birthDate,
    codSexo: patient.biologicalSex == 'Masculino' ? 'M' : 'F',
    codPaisResidencia: 'CO',
    codMunicipioResidencia: patient.cityCode,
    codZonaTerritorialResidencia: patient.territorialZoneCode,
    incapacidad: '00',
    consecutivo: 1,
    codPaisOrigen: 'CO',
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
  const fechaInicioAtencion = order.orderCycle.find(
    (cycle: any) => cycle.type === 'admission'
  )?.at

  return {
    fechaInicioAtencion,
    numAutorizacion: null,
    codConsulta: '01',
    modalidadGrupoServicioTecSal: '01',
    grupoServicios: '01',
    codServicio: 1,
    finalidadTecnologiaSalud: '01',
    causaMotivoAtencion: '01',
    codDiagnosticoPrincipal: 'A00',
    codDiagnosticoRelacionado1: null,
    codDiagnosticoRelacionado2: null,
    codDiagnosticoRelacionado3: null,
    tipoDiagnosticoPrincipal: '01',
    tipoDocumentoIdentificacion: 'CC',
    numDocumentoIdentificacion: order?.finalizedBy?.document ?? '',
    vrServicio: 10000,
    conceptoRecaudo: '01',
    valorPagoModerador: 0,
    numFEVPagoModerador: null,
    consecutivo: 1,
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
