export interface payments {
  id: number;
  datetime: string;
  amount: number;
  description: any;
}

export interface c_payments extends payments {
  cdf: number | string;
  entityType: "هزینه شارژ حساب" | "";
}
