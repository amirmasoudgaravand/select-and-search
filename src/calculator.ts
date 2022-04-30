import {
  concurrency_costs,
  c_concurrency_costs,
} from "./models/concurrency_costs";
import { c_misc_expenses, misc_expenses } from "./models/misc_expenses";
import { c_payments, payments } from "./models/payment";
import { c_trip_financials, trip_financials } from "./models/trip_financials";

export interface Filter {
  entityType: string;
  driver: string;
}

export type input = Array<
  | Array<concurrency_costs>
  | Array<misc_expenses>
  | Array<payments>
  | Array<trip_financials>
>;
export type mixedEntities =
  | concurrency_costs
  | misc_expenses
  | payments
  | trip_financials;
export type concated = Array<mixedEntities>;
export type convertedMixedEntities =
  | c_concurrency_costs
  | c_misc_expenses
  | c_payments
  | c_trip_financials;
export type output = Array<convertedMixedEntities>;
export type categorizedData = Array<Array<convertedMixedEntities>>;

export function calculator(data: input): output {
  let concatedData: concated = [];
  for (let i = 0; i < data.length; i++) {
    concatedData = [...concatedData, ...data[i]];
  }

  let costomData: output = [];
  for (let i = 0; i < concatedData.length; i++) {
    let convertedItem: convertedMixedEntities = {
      ...concatedData[i],
      cdf: "",
      entityType: "",
    };
    if (Object.keys(concatedData[i]).includes("datetime")) {
      let ts: number = new Date((concatedData[i] as any)["datetime"]).getTime();
      convertedItem["cdf"] = ts;
      convertedItem.entityType = "هزینه شارژ حساب";
    }

    if (Object.keys(concatedData[i]).includes("created_at")) {
      let ts: number = new Date(
        (concatedData[i] as any)["created_at"]
      ).getTime();
      convertedItem["cdf"] = ts;
      if (Object.keys(concatedData[i]).includes("start_date")) {
        convertedItem.entityType = "هزینه خرید ظرفیت";
      } else {
        convertedItem.entityType = "هزینه متفرقه";
      }
    }

    if (Object.keys(concatedData[i]).includes("request_datetime")) {
      let ts: number = new Date(
        (concatedData[i] as any)["request_datetime"]
      ).getTime();
      convertedItem["cdf"] = ts;
      convertedItem.entityType = "هزینه سفر";
    }
    costomData.push(convertedItem);
  }

  costomData.sort((a: convertedMixedEntities, b: convertedMixedEntities) =>
    a.cdf > b.cdf ? -1 : 1
  );
  let customDataConvdertedCDF = costomData.map(
    (item: convertedMixedEntities) => {
      return {
        ...item,
        cdf: new Date(item.cdf).toLocaleString("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date(item.cdf).toLocaleString("fa-IR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      };
    }
  );

  return customDataConvdertedCDF;
}

export function categorize(data: output): categorizedData {
  let res: categorizedData = [];
  let dates: Array<string | number> = [];
  for (let i = 0; i < data.length; i++) {
    if (!dates.includes(data[i].cdf)) {
      dates.push(data[i].cdf);
    }
  }
  for (let i = 0; i < dates.length; i++) {
    let currentDateData = [];
    for (let j = 0; j < data.length; j++) {
      if (data[j].cdf === dates[i]) {
        currentDateData.push(data[j]);
      }
    }
    res.push(currentDateData);
  }
  return res;
}

export function filtredCategories(
  data: categorizedData,
  filter: Filter
): categorizedData {
  if (filter.entityType === "همه تراکنش ها") return data;
  if (filter.entityType === "هزینه سفر") {
    let filteredData: categorizedData = [];
    for (let i = 0; i < data.length; i++) {
      let item = [];
      for (let j = 0; j < data[i].length; j++) {
        if (filter.driver === "") {
          if (data[i][j].entityType === filter.entityType) {
            item.push(data[i][j]);
          }
        } else {
          if (
            data[i][j].entityType === filter.entityType &&
            (data[i][j] as c_trip_financials).driver.includes(filter.driver)
          ) {
            item.push(data[i][j]);
          }
        }
      }
      filteredData.push(item);
    }
    return filteredData;
  } else {
    let filteredData: categorizedData = [];
    for (let i = 0; i < data.length; i++) {
      let item = [];
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j].entityType === filter.entityType) {
          item.push(data[i][j]);
        }
      }
      filteredData.push(item);
    }
    return filteredData;
  }
}
