import { schedule } from 'node-cron'
import { config } from 'dotenv'
config()
import constants from './config'
import { syncGeneral } from './services/sync-general'
import { syncMedical } from './services/sync-medical'
import { syncMedicalAnnotations } from './services/sync-medical-annotations'

const CronJobExpression = constants().CRON_EXPRESSION

schedule(CronJobExpression, async () => {
  console.log(`Cron job started ... at ${CronJobExpression}`)
  syncGeneral()
  syncMedical()
  syncMedicalAnnotations()
})

console.log(`Cron job started ... at ${CronJobExpression}`)
