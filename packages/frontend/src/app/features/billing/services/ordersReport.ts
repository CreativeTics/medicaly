import { formatCurrency } from '@/app/core/util/currencies'
import { formatDate } from '@/app/core/util/dates'
import { DB, PouchService } from '@/app/services/pouch'
import ExcelJS from 'exceljs'

const pouch = new PouchService()

// REPORTE DE ORDENES PROCESADAS PARA APOYO LABORAL TS S.A.S ENTRE 29-11-2024 y 29-11-2024
// CODIGO	FECHA	NOMBRE	CEDULA	SEDE/FINCA	TIPO EXAMEN	EXAMEN	COSTO EXAMEN	RESTRICCIONES	RECOMENDACIONES	DIAGNOSTICO	LUGAR

export async function downloadInvoiceOrdersReport(invoice: any): Promise<void> {
  const wb = await createInvoiceOrdersReport(invoice)
  await wb.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Reporte de ordenes - ${invoice.contractName} - ${invoice.startDate} - ${invoice.endDate}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  })
}

async function createInvoiceOrdersReport(
  invoice: any
): Promise<ExcelJS.Workbook> {
  const { startDate, endDate, subsidiaryName, contractName, orders } = invoice

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Reporte de ordenes')

  // Encabezado principal
  const title = `REPORTE DE ORDENES PROCESADAS PARA ${contractName} ENTRE ${startDate} y ${endDate}`
  worksheet.addRow([title])
  worksheet.mergeCells('A1:L1')
  worksheet.getCell('A1').alignment = { horizontal: 'center' }
  worksheet.getCell('A1').font = {
    bold: true,
    name: 'Times New Roman',
    size: 10,
  }

  // Encabezados de columnas
  const headers = [
    'CODIGO',
    'FECHA',
    'NOMBRE',
    'CEDULA',
    'SEDE/FINCA',
    'TIPO EXAMEN',
    'EXAMEN',
    'COSTO EXAMEN',
    'RESTRICCIONES',
    'RECOMENDACIONES',
    'DIAGNOSTICO',
    'LUGAR',
  ]
  worksheet.addRow(headers).eachCell((cell) => {
    cell.font = { bold: true, name: 'Times New Roman', size: 10 }
    cell.alignment = { horizontal: 'center' }
  })

  // Ajustar ancho de columnas
  worksheet.columns = [
    { width: 11.17 },
    { width: 10.67 },
    { width: 20.33 },
    { width: 10.67 },
    { width: 34.33 },
    { width: 31.5 },
    { width: 35.5 },
    { width: 15.17 },
    { width: 21.83 },
    { width: 23.83 },
    { width: 25.83 },
    { width: 15.17 },
  ]
  const servicesResume: Map<
    string,
    {
      total: number
      unitAmount: number
      totalAmount: number
    }
  > = new Map()
  // Agregar datos de órdenes
  await Promise.all(
    orders.map(async (order: any) => {
      order.services.forEach((service: any) => {
        const key = `${service.code}-${service.name}`
        if (!servicesResume.has(key)) {
          servicesResume.set(key, {
            total: 0,
            unitAmount: service.amount,
            totalAmount: 0,
          })
        }

        const serviceData = servicesResume.get(key)
        if (serviceData) {
          serviceData.total++
          serviceData.totalAmount += Number(service.amount)
        }
      })

      const { diagnosis, recommendations, restrictions } = await getDiagnosis(
        order.id
      )

      const row = worksheet.addRow([
        order.code,
        formatDate(order.finalizedAt),
        order.patientName.split(' - ')[1],
        order.patientName.split(' - ')[0],

        order.contractSubsidiary,
        order.medicalExamTypeName,
        '',
        '',
        restrictions,
        recommendations,
        diagnosis,
        subsidiaryName,
      ])

      row.getCell('G').value = {
        richText: [
          ...order.services.map((service: any) => ({
            text: `${service.code} - ${service.name}\n`,
          })),
          {
            text: 'TOTAL:\n',
            font: { bold: true },
          },
        ],
      }

      row.getCell('H').value = {
        richText: [
          ...order.services.map((service: any) => ({
            text: `${formatCurrency(service.amount)}\n`,
          })),
          {
            text: formatCurrency(order.totalAmount),
            font: { bold: true },
          },
        ],
      }

      row.eachCell((cell) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'left',
        }
        cell.font = { name: 'Times New Roman', size: 10 }
      })

      row.getCell('A').font = {
        bold: true,
        name: 'Times New Roman',
        size: 10,
      }

      row.getCell('H').alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'right',
      }
    })
  )

  // Agregar resumen de servicios
  worksheet.addRow([''])
  worksheet.mergeCells(`A${worksheet.rowCount}:L${worksheet.rowCount}`)

  const row = worksheet.addRow([
    '',
    '',
    'DESCRIPCION',
    'CANTIDAD',
    'VALOR U.',
    'TOTAL',
  ])
  row.eachCell((cell) => {
    cell.font = { bold: true, name: 'Times New Roman', size: 10 }
    cell.alignment = { horizontal: 'center' }
  })
  row.getCell('C').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
  }
  row.getCell('D').border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
  }
  row.getCell('E').border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
  }

  row.getCell('F').border = {
    top: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' },
  }

  servicesResume.forEach((service, key) => {
    const row = worksheet.addRow([
      '',
      '',

      key,
      service.total,
      formatCurrency(service.unitAmount),
      formatCurrency(service.totalAmount),
    ])

    row.eachCell((cell) => {
      cell.font = { name: 'Times New Roman', size: 10 }
      cell.alignment = { horizontal: 'center' }
    })

    row.getCell('C').border = {
      left: { style: 'thin' },
    }
    row.getCell('E').alignment = { horizontal: 'right' }
    row.getCell('F').alignment = { horizontal: 'right' }
    row.getCell('F').border = {
      right: { style: 'thin' },
    }
    row.getCell('F').font = { bold: true, name: 'Times New Roman', size: 10 }
  })

  //   last row set top border
  const lastRow = worksheet.getRow(worksheet.rowCount)

  lastRow.getCell('C').border = {
    bottom: { style: 'thin' },
    left: { style: 'thin' },
  }
  lastRow.getCell('D').border = {
    bottom: { style: 'thin' },
  }
  lastRow.getCell('E').border = {
    bottom: { style: 'thin' },
  }
  lastRow.getCell('F').border = {
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  }

  return workbook
}

async function getDiagnosis(orderId: any): Promise<{
  restrictions: string
  recommendations: string
  diagnosis: string
}> {
  const EXAM_MEDICAL_ID = 'e6ce571a03dba5b38099b6852d000762'

  const order = await pouch.use(DB.GENERAL).get(orderId)

  let annotationId = ''

  order.services.forEach((service: any) => {
    if (annotationId) return

    annotationId = service.annotations.find((annotationId: any) =>
      annotationId.includes(EXAM_MEDICAL_ID)
    )
  })

  if (!annotationId) {
    return {
      restrictions: '',
      recommendations: '',
      diagnosis: '',
    }
  }

  const annotation = await pouch.use(DB.MEDICAL).get(annotationId)

  return {
    restrictions: annotation.diagnosisRestrictions.join('\n'),
    recommendations: annotation.diagnosisRecommendations.join('\n'),
    diagnosis: annotation.diagnosis.join('\n'),
  }
}
