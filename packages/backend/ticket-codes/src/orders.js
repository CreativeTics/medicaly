import axios from "axios";
import constants from "./const.js";
import chalk from "chalk";

const axiosClient = axios.create({
  baseURL: constants().DB.URL,
  auth: {
    username: constants().DB.USERNAME,
    password: constants().DB.PASSWORD,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

const getUnCodedOrders = async () => {
  const { data } = await axiosClient.post("/general/_find", {
    fields: ["_id", "code", "subsidiary"],
    selector: {
      doctype: "service-orders",
      code: "Por generar",
      isDeleted: false,
    },
  });
  return data.docs;
};

const updateOrder = async (newOrder) => {
  const { data } = await axiosClient.get(`/general/${newOrder._id}`);
  data.code = newOrder.code;
  await axiosClient.put(`/general/${newOrder._id}`, data);
};

const updateSubsidiaryNumbers = async (subsidiary) => {
  const { data } = await axiosClient.get(`/general/${subsidiary._id}`);

  await axiosClient.put(`/general/${subsidiary._id}`, {
    ...data,
    lastOrderNumber: subsidiary.lastOrderNumber,
  });
};

const getSubsidiary = async (subsidiaryId) => {
  const { data } = await axiosClient.get(`/general/${subsidiaryId}`);
  return data;
};

export const generateOrderCodes = async () => {
  try {
    console.log(chalk.yellow("Searching uncoded orders ..."));
    const orders = await getUnCodedOrders();
    console.log(chalk.yellow(`Found ${orders.length} uncoded orders`));

    if (!orders.length) {
      console.log(chalk.yellow("No orders to update"));
      return;
    }

    const subsidiaryIds = new Set(orders.map((order) => order.subsidiary));

    const subsidiaries = await Promise.all(
      Array.from(subsidiaryIds.keys()).map((subsidiaryId) =>
        getSubsidiary(subsidiaryId)
      )
    );

    const subsidiariesMap = new Map(
      subsidiaries.map((subsidiary) => [subsidiary._id, subsidiary])
    );

    for (const order of orders) {
      const subsidiary = subsidiariesMap.get(order.subsidiary);
      const lastOrderNumber = Number(subsidiary.lastOrderNumber || 0);
      const ticketNumber = lastOrderNumber + 1;
      const numberFormatted = ticketNumber.toString().padStart(6, "0");
      const newCode = `${subsidiary.prefix}-${numberFormatted}`;

      console.log("newCode", newCode);

      await updateOrder({ _id: order._id, code: newCode });
      // update subsidiary lastOrderNumber
      subsidiary.lastOrderNumber = ticketNumber;
      console.log(
        chalk.green(`Order ${order._id} updated with code ${newCode}`)
      );
    }
    console.log(chalk.green("All orders updated"));
    console.log(chalk.yellow("Updating subsidiary numbers ..."));
    // update subsidiary numbers
    await Promise.all(
      subsidiaries.map((subsidiary) => updateSubsidiaryNumbers(subsidiary))
    );
    console.log(chalk.green("All subsidiary numbers updated"));
  } catch (error) {
    console.log(chalk.red(error));
  }
};
