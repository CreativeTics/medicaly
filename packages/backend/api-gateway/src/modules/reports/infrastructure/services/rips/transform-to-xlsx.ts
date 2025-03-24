import ExcelJS from 'exceljs'
import { RipsTransaction } from './types'

export function transformRipsTransactionToXlsx(
  report: RipsTransaction
): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook()
  wb.addWorksheet('transaccion').addRows([
    ['numDocumentoIdObligado', 'numFactura', 'tipoNota', 'numNota'],
    [
      report.numDocumentoIdObligado,
      report.numFactura,
      report.tipoNota,
      report.numNota,
    ],
  ])

  wb.addWorksheet('usuarios').addRows([
    [
      'tipoDocumentoldentificacion',
      'numDocumentoIdentificacion',
      'num_DocumentoIdObligado',
      'tipoUsuario',
      'fechaNacimiento',
      'codSexo',
      'codPaisResidencia',
      'codMunicipioResidencia',
      'codZonaTerritorialResidencia',
      'incapacidad',
      'codPaisOrigen',
      'consecutivo',
    ],
    ...report.usuarios.map((usuario) => [
      usuario.tipoDocumentoldentificacion,
      usuario.numDocumentoIdentificacion,
      report.numDocumentoIdObligado,
      usuario.tipoUsuario,
      usuario.fechaNacimiento,
      usuario.codSexo,
      usuario.codPaisResidencia,
      usuario.codMunicipioResidencia,
      usuario.codZonaTerritorialResidencia,
      usuario.incapacidad,
      usuario.codPaisOrigen,
      usuario.consecutivo,
    ]),
  ])

  wb.addWorksheet('consultas').addRows([
    [
      'num_DocumentoIdObligado',
      'consecutivoUsuario',
      'codPrestador',
      'fechaInicioAtencion',
      'numAutorizacion',
      'codConsulta',
      'modalidadGrupoServicioTecSal',
      'grupoServicios',
      'codServicio',
      'finalidadTecnologiaSalud',
      'causaMotivoAtencion',
      'codDiagnosticoPrincipal',
      'codDiagnosticoRelacionado1',
      'codDiagnosticoRelacionado2',
      'codDiagnosticoRelacionado3',
      'tipoDiagnosticoPrincipal',
      'tipoDocumentoIdentificacion',
      'numDocumentoIdentificacion',
      'vrServicio',
      'conceptoRecaudo',
      'valorPagoModerador',
      'numFEVPagoModerador',
      'consecutivo',
    ],
    ...report.usuarios.flatMap((usuario) =>
      usuario.servicios.consultas.map((consulta) => [
        report.numDocumentoIdObligado,
        usuario.consecutivo,
        'codPrestador',
        consulta.fechaInicioAtencion,
        consulta.numAutorizacion,
        consulta.codConsulta,
        consulta.modalidadGrupoServicioTecSal,
        consulta.grupoServicios,
        consulta.codServicio,
        consulta.finalidadTecnologiaSalud,
        consulta.causaMotivoAtencion,
        consulta.codDiagnosticoPrincipal,
        consulta.codDiagnosticoRelacionado1,
        consulta.codDiagnosticoRelacionado2,
        consulta.codDiagnosticoRelacionado3,
        consulta.tipoDiagnosticoPrincipal,
        consulta.tipoDocumentoIdentificacion,
        consulta.numDocumentoIdentificacion,
        consulta.vrServicio,
        consulta.conceptoRecaudo,
        consulta.valorPagoModerador,
        consulta.numFEVPagoModerador,
        consulta.consecutivo,
      ])
    ),
  ])

  return wb
}
