import { Client, Pool } from 'pg'
import constants from '../config'

const pool = new Pool({
  connectionString: constants().WAREHOUSE_DB.URL,
  max: 20,
})

export async function query(query?: string, values: any[] = []) {
  return await pool.query(query, values)
}

export async function disconnect() {
  if (pool) {
    await pool.end()
  }
}

export async function getLastEventId(database: string) {
  return (
    await pool.query(
      `SELECT * FROM sync_control WHERE database = '${database}' `
    )
  ).rows
}

export async function updateLastEventId(database: string, lastEventId: string) {
  await pool.query(
    `UPDATE sync_control SET last_completed_sync = '${lastEventId}' WHERE database = '${database}' `
  )
}
