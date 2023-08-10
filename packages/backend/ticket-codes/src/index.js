import { schedule } from "node-cron";
import { config } from "dotenv";
config();
import chalk from "chalk";
import constants from "./const.js";
import { generateOrderCodes } from "./orders.js";

const CronJobExpression = constants().CRON_EXPRESSION;

console.log("CronJobExpression", CronJobExpression);
schedule(CronJobExpression, async () => {
  await generateOrderCodes();
});

console.log(chalk.yellow(`Cron job started ... at ${CronJobExpression}`));
