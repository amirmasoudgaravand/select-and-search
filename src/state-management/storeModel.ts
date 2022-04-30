import { concurrency_costs } from "../models/concurrency_costs";
import { misc_expenses } from "../models/misc_expenses";
import { payments } from "../models/payment";
import { trip_financials } from "../models/trip_financials";

export interface StoreModel {
  data: {
    trip_financials: Array<trip_financials>;
    payments: Array<payments>;
    misc_expenses: Array<misc_expenses>;
    concurrency_costs: Array<concurrency_costs>;
  } | null;
}
