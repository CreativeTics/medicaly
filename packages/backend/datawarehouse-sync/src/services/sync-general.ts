import { PoolClient } from 'pg'
import { query, getLastEventId, updateLastEventId } from '../util/pg-client'
import { getChanges, getDoc } from './get-couch-changes'

let client: PoolClient = null

export async function syncGeneral() {
  const lastEventId = await getLastEventId('general')

  const changes = await getChanges(
    'general',
    lastEventId[0]?.last_completed_sync
  )

  const tickets = changes.data.results.filter(
    (change) => change.doc.doctype === 'service-orders'
  )

  console.log(`tickets :: found ${tickets.length} changes`)

  for (const change of tickets) {
    if (change.doc.doctype === 'service-orders') {
      await upsertTicket(change.doc as Ticket)
      await updateLastEventId('general', change.seq)
    }
  }
  await updateLastEventId('general', changes.data.last_seq)
  console.log(`tickets :: ${tickets.length} changes synced`)
}

export interface Ticket {
  _id: string
  code: string
  status: string
  contractName: string
  contractCostCenter: string
  contractSubsidiary: string
  subsidiary: string
  position: string
  observation: string
  patientId: string
  patientDataId: string
  patientIsNew: boolean
  orderCycle: any
  services: any
  isDeleted: boolean
  createdAt: string
  admittedBy: object | null
  finalizedBy: object | null
}

async function upsertTicket(ticket: Ticket) {
  // validate if exists and delete if exists
  const exist = await query(`SELECT * FROM tickets WHERE id = '${ticket._id}'`)

  if (exist.rows.length > 0) {
    await query(`DELETE FROM tickets WHERE id = '${ticket._id}'`)
  }

  ticket = await enrichTicket(ticket)

  await query(
    `
    INSERT INTO tickets (
      id,
      code,
      status,
      contract_name,
      contract_cost_center,
      contract_subsidiary,
      subsidiary,
      position,
      observation,
      patient_id,
      patient_data_id,
      patient_is_new,
      order_cycle,
      services,
      admitted_by,
      finalized_by,
      is_deleted,
      created_at
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14,
      $15,
      $16,
      $17,
      $18
    )
  `,
    [
      ticket._id,
      ticket.code,
      ticket.status,
      ticket.contractName,
      ticket.contractCostCenter,
      ticket.contractSubsidiary,
      ticket.subsidiary,
      ticket.position,
      ticket.observation,
      ticket.patientId || '',
      ticket.patientDataId || '',
      ticket.patientIsNew,
      JSON.stringify(ticket.orderCycle),
      JSON.stringify(ticket.services),
      JSON.stringify(ticket.admittedBy),
      JSON.stringify(ticket.finalizedBy),
      ticket.isDeleted,
      ticket.createdAt,
    ]
  )
}

async function enrichTicket(ticket: Ticket) {
  const costCenter = await getDoc('general', ticket.contractCostCenter || '')

  const contractSubsidiary = await getDoc(
    'general',
    ticket.contractSubsidiary || ''
  )
  const subsidiary = await getDoc('general', ticket.subsidiary || '')
  const position = await getDoc('general', ticket.position || '')

  return {
    ...ticket,
    contractCostCenter: `${costCenter.code} - ${costCenter.name}`,
    contractSubsidiary: `${contractSubsidiary.code} - ${contractSubsidiary.name}`,
    subsidiary: `${subsidiary.code} - ${subsidiary.name}`,
    position: `${position.code} - ${position.name}`,
  }
}
