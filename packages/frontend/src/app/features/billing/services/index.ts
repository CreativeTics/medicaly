import { getData } from '@/app/core/services/get-table'
import { OrderStatus } from '@/app/core/types/order-status'
import { formatCurrency } from '@/app/core/util/currencies'
import { DB, PouchService } from '@/app/services/pouch'
import {
  AccountOfFinishedOrders,
  AccountOfFinishedOrdersFilters,
} from '@/store/billing'

const pouch = new PouchService()

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

export async function getAccountOfFinishedOrders(
  searchOptions: AccountOfFinishedOrdersFilters
): Promise<AccountOfFinishedOrders[]> {
  console.log('searchOptions', searchOptions)

  let where: {
    [key: string]: any
  } = {
    status: OrderStatus.completed,
    invoice: { $exists: false },
    // finalizedAt: {
    //   $gte: searchOptions.startDate,
    //   $lte: searchOptions.endDate,
    // },
  }

  if (searchOptions.subsidiaryId) {
    where.subsidiary = searchOptions.subsidiaryId
  }

  if (searchOptions.contractName) {
    where.contractName = { $regex: `(?i).*${searchOptions.contractName}.*` }
  }

  const subsidiaries = (await getSubsidiariesList()).reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {} as { [key: string]: any })

  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:service-orders`,
    fields: ['id', 'subsidiary', 'contractName', 'services', 'finalizedAt'],
    where,
  })

  const contracts: {
    [key: string]: AccountOfFinishedOrders
  } = {}

  data.forEach((doc: any) => {
    const key = `${doc.contractId}-${doc.subsidiary}`
    if (!contracts[key]) {
      contracts[key] = {
        contractName: doc.contractName,
        contractId: doc.contract,
        subsidiaryId: doc.subsidiary,
        subsidiaryName: subsidiaries[doc.subsidiary].name,
        totalOrders: 0,
        totalAmount: 0,
        totalAmountFormatted: '',
        orders: [],
        filters: searchOptions,
      }
    }

    contracts[key].totalOrders++
    contracts[key].totalAmount += doc.services.reduce(
      (acc: number, service: any) => acc + Number(service.amount),
      0
    )
    contracts[key].totalAmountFormatted = formatCurrency(
      contracts[key].totalAmount
    )
    contracts[key].orders.push(doc.id)
  })

  return Object.values(contracts)
}

export async function loadOrdersFormIds(orderIds: string[]) {
  return await Promise.all(orderIds.map((orderId) => loadOrderFromId(orderId)))
}

async function loadOrderFromId(orderId: string) {
  const rawOrder = await pouch.use(DB.GENERAL).get(orderId)

  const rawContractSubsidiary = await pouch
    .use(DB.GENERAL)
    .get(rawOrder.contractSubsidiary)

  return {
    id: rawOrder.id,
    code: rawOrder.code,
    services: rawOrder.services.map((service: any) => ({
      code: service.code,
      name: service.name,
      amount: service.amount,
    })),
    totalAmount: rawOrder.services.reduce(
      (acc: number, service: any) => acc + Number(service.amount),
      0
    ),
    medicalExamTypeName: rawOrder.medicalExamTypeName,
    contractSubsidiaryId: rawOrder.contractSubsidiary,
    contractSubsidiary: rawContractSubsidiary.name,
    patientName: rawOrder.patientName,
    createdAt: rawOrder.createdAt,
    finalizeAt: rawOrder.finalizeAt,
  }
}

export async function getContractList() {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:contracts`,
    fields: ['id', 'name'],
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
    }
  })
}

export async function getContractSubsidiaries(contractId: string) {
  const data = await getData<any[]>({
    entity: `${DB.GENERAL}:contract-subsidiaries`,
    fields: ['id', 'name'],
    where: {
      contractId: contractId,
    },
  })

  return data.map((doc: any) => {
    return {
      id: doc.id,
      name: doc.name,
    }
  })
}

export async function changeContractSubsidiary(
  orderId: string,
  contractSubsidiaryId: string
) {
  const oldOrder = await pouch.use(DB.GENERAL).get(orderId)

  const newSubsidiary = await pouch.use(DB.GENERAL).get(contractSubsidiaryId)
  const newContract = await pouch.use(DB.GENERAL).get(newSubsidiary.contractId)

  const newOrder = {
    ...oldOrder,
    contract: newContract.id,
    contractName: newContract.name,
    contractSubsidiary: newSubsidiary.id,
    contractSubsidiaryName: newSubsidiary.name,
  }

  await pouch.use(DB.GENERAL).update(newOrder)
}
