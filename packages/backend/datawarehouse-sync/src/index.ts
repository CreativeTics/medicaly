import { config } from 'dotenv'
import { schedule } from 'node-cron'
import constants from './config'
import { syncGeneral } from './services/sync-general'
import { syncMedical } from './services/sync-medical'
config()

const CronJobExpression = constants().CRON_EXPRESSION

schedule(CronJobExpression, async () => {
  console.log(`Cron job started ... at ${CronJobExpression}`)
  await syncGeneral()
  await syncMedical()
})

console.log(`Cron job started ... at ${CronJobExpression}`)
