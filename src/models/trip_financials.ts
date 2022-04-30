export interface trip_financials {
  id: number;
  request_datetime: string;
  driver: string;
  final_price: number;
  source_title: string;
  hub: {
    id: number;
    title: string;
  };
}

export interface c_trip_financials extends trip_financials {
  cdf: number | string;
  entityType: "هزینه سفر" | "";
}
