export interface concurrency_costs {
  id: number;
  created_at: string;
  amount: number;
  start_date: string;
  end_date: string;
}

export interface c_concurrency_costs extends concurrency_costs {
  cdf: number | string;
  entityType: "هزینه خرید ظرفیت" | "";
}
