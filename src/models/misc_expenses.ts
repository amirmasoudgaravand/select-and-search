export interface misc_expenses {
  id: number;
  title: string;
  created_at: string;
  amount: number;
}

export interface c_misc_expenses extends misc_expenses {
  cdf: number | string;
  entityType: "هزینه متفرقه" | "";
}
