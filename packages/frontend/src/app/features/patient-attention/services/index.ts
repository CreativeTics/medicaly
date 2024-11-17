import { getData } from '../../../core/services/get-table/'
import { formatDate } from '@/app/core/util/dates'

import { PouchService, DB } from '../../../services/pouch'
// import { useAuthStore } from "@/store/auth";
import { OrderStatus } from '@/app/core/types/order-status'
import { OrderCycleTypes } from '@/app/core/types/order-cycle-types'
import { useAuthStore } from '@/store/auth'

const pouch = new PouchService()
const doctype = 'service-orders'

export async function getSubsidiariesList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:subsidiaries`,
    fields: ['id', 'name'],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
    }
  })
}

export async function getList(searchOptions: any) {
  const where: any = {
    status: OrderStatus.inprogress,
  }

  if (searchOptions.subsidiary) {
    where['subsidiary'] = searchOptions.subsidiary
    // save in local storage
    localStorage.setItem('user-subsidiary', searchOptions.subsidiary)
  }

  if (searchOptions.orderCode) {
    where['code'] = { $regex: `(?i).*${searchOptions.orderCode}.*` }
  }

  if (searchOptions.patient) {
    where['patientName'] = { $regex: `(?i).*${searchOptions.patient}.*` }
  }

  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:${doctype}`,
    fields: [
      'id',
      'code',
      'services',
      'contractName',
      'medicalExamTypeName',
      'patientName',
      'status',
      'createdAt',
      'orderCycle',
    ],
    where: where,
    limit: 100,
    sort: [{ createdAt: 'desc' }],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      code: doc.code,
      services: doc.services,
      contractName: doc.contractName,
      type: doc.medicalExamTypeName,
      patientName: doc.patientName,
      status: doc.status,
      createdAt: formatDate(doc.createdAt, true),
      admittedAt: getAdmittedAtFromOrderCycle(doc.orderCycle),
    }
  })
}

function getAdmittedAtFromOrderCycle(orderCycle: any) {
  if (!orderCycle) {
    return ''
  }
  const admissionCycle = orderCycle.find(
    (orderCycle: any) => orderCycle.type === OrderCycleTypes.admission
  )
  return formatDate(admissionCycle.at, true)
}

export async function getOrder(id: string) {
  const order = await pouch.use(DB.GENERAL).get(id)

  // get contractSubsidiary
  const contractSubsidiary = await pouch
    .use(DB.GENERAL)
    .get(order.contractSubsidiary)
  // get contractCostCenter
  const contractCostCenter = await pouch
    .use(DB.GENERAL)
    .get(order.contractCostCenter)
  // get medicalExamType
  const medicalExamType = await pouch.use(DB.GENERAL).get(order.medicalExamType)

  return {
    ...order,
    contractSubsidiary: {
      id: contractSubsidiary.id,
      name: contractSubsidiary.name,
    },
    contractCostCenter: {
      id: contractCostCenter.id,
      name: contractCostCenter.name,
    },
    medicalExamType: {
      id: medicalExamType.id,
      name: medicalExamType.name,
      emphasis: medicalExamType.emphasis,
    },
  }
}

export async function getFinalizeOrderPermission() {
  const user = useAuthStore().user
  if (!user || user.type !== 'employee') {
    return false
  }
  const employee = await pouch.use(DB.GENERAL).get(user.relations[0])

  const position = await pouch.use(DB.GENERAL).get(employee.position)

  return position.allowFinishServiceOrder || false
}
