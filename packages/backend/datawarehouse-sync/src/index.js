const { start } = require("./couchwarehouse/index.js");
const chalk = require("chalk");

// configuration
const opts = {
  url: "https://4dm1n-us3r:4dm1n-p4ssw0rd!!@localhost:5984",
  database: "general",
  verbose: true,
  split: "doctype",
};

const main = async () => {
  console.log(chalk.yellow("sync init"));
  await start(opts)
    .then((data) => {
      console.log(chalk.yellow(data));
    })
    .catch((err) => {
      console.log(chalk.red(err));
    });
};
main();
