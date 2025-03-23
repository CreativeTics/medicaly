import { getData } from '@/app/core/services/get-table'
import { formatCurrency } from '@/app/core/util/currencies'
import { formatDate } from '@/app/core/util/dates'
import { DB, PouchService } from '@/app/services/pouch'
import { AccountOfFinishedOrders } from '@/store/billing'

const pouch = new PouchService()

export async function createInvoice(
  account: AccountOfFinishedOrders,
  orders: any[]
): Promise<string> {
  console.log('Creating invoice for account:', account)

  const invoice = {
    doctype: 'invoice',
    invoiceNumber: '',
    subsidiary: account.subsidiaryId,
    subsidiaryName: account.subsidiaryName,
    contract: account.contractId,
    contractName: account.contractName,
    startDate: account.filters?.startDate,
    endDate: account.filters?.endDate,
    orders: orders,
    totalOrders: orders.length,
    totalAmount: orders.reduce((acc, order) => acc + order.totalAmount, 0),
  }
  const invoiceCreated = await pouch.use(DB.BILLING).create(invoice)

  console.log('Invoice created:', invoiceCreated)

  if (invoiceCreated?.id) {
    // Set invoice to orders
    await Promise.all(
      orders.map((order) => setInvoiceToOrder(order.id, invoiceCreated.id))
    )

    return invoiceCreated.id
  }
  return ''
}

async function setInvoiceToOrder(
  orderId: string,
  invoiceId: string
): Promise<void> {
  await pouch.use(DB.GENERAL).updateOnly(orderId, { invoice: invoiceId })
}

export function getInvoice(id: string) {
  return pouch.use(DB.BILLING).get(id)
}

export interface Invoice {
  id: string
  invoiceNumber: string
  subsidiaryName: string
  contractName: string
  startDate: string
  range: string
  endDate: string
  totalOrders: number
  totalAmount: string
  createdAt: string
}

export async function getInvoices(searchOptions: any): Promise<Invoice[]> {
  const where: Record<string, any> = {}

  if (searchOptions.startDate && searchOptions.endDate) {
    where.createdAt = {
      $gte: searchOptions.startDate,
      $lte: searchOptions.endDate,
    }
  }

  console.log('searchOptions', searchOptions.subsidiaryId)
  if (searchOptions.subsidiaryId) {
    where.subsidiary = searchOptions.subsidiaryId
  }
  console.log('searchOptions', searchOptions.contractName)
  if (searchOptions.contractName) {
    where.contractName = { $regex: `(?i).*${searchOptions.contractName}.*` }
  }

  const data = await getData<Invoice[]>({
    entity: `${DB.BILLING}:invoice`,
    fields: [
      'id',
      'invoiceNumber',
      'subsidiaryName',
      'contractName',
      'startDate',
      'endDate',
      'totalOrders',
      'totalAmount',
      'createdAt',
    ],
    where,
    sort: [{ createdAt: 'desc' }],
  })

  return data.map((doc) => {
    return {
      id: doc.id,
      invoiceNumber: doc.invoiceNumber,
      subsidiaryName: doc.subsidiaryName,
      contractName: doc.contractName,
      range: `${formatDate(doc.startDate)} - ${formatDate(doc.endDate)}`,
      startDate: doc.startDate,
      endDate: doc.endDate,
      totalOrders: doc.totalOrders,
      totalAmount: formatCurrency(Number(doc.totalAmount)),
      createdAt: doc.createdAt,
    }
  })
}

export async function changeInvoiceNumber(
  invoiceId: string,
  invoiceNumber: string
) {
  await pouch.use(DB.BILLING).updateOnly(invoiceId, { invoiceNumber })
}
