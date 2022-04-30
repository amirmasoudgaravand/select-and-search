import { useDispatch, useSelector } from "react-redux";
import { StoreModel } from "./state-management/storeModel";
import { useEffect, useState } from "react";
import { ReduxActions } from "./state-management/reduxActions";
import Select from "react-select";
import "./App.css";
import {
  calculator,
  categorize,
  categorizedData,
  convertedMixedEntities,
  Filter,
  filtredCategories,
  output,
} from "./calculator";

const options = [
  { value: "همه تراکنش ها", label: "همه تراکنش ها" },
  { value: "هزینه شارژ حساب", label: "هزینه شارژ حساب" },
  { value: "هزینه خرید ظرفیت", label: "هزینه خرید ظرفیت" },
  { value: "هزینه متفرقه", label: "هزینه متفرقه" },
  { value: "هزینه سفر", label: "هزینه سفر" },
];

function App() {
  const [convertedData, setConvertedData] = useState<categorizedData>([]);
  const [filter, setFilter] = useState<Filter>({
    entityType: "همه تراکنش ها",
    driver: "",
  });
  const storeData: StoreModel["data"] = useSelector<
    StoreModel,
    StoreModel["data"]
  >((store: StoreModel) => store.data);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        dispatch({ type: ReduxActions.setData, payload: res });
      });
  }, []);

  useEffect(() => {
    if (storeData !== null) {
      let res: output = calculator([
        storeData.concurrency_costs,
        storeData.misc_expenses,
        storeData.payments,
        storeData.trip_financials,
      ]);
      let res2: categorizedData = categorize(res);
      let finalRes: categorizedData = filtredCategories(res2, filter);
      console.log(finalRes, "firerrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
      setConvertedData(finalRes);
    } else {
      setConvertedData([]);
    }
  }, [storeData, filter]);
  console.log("convertedData", convertedData[0]);
  return (
    <div className="container">
      <div className="navbar">
        <div className="wraaper-select">
          <div className="display-flex">
            <Select
              className=""
              options={options}
              value={{ label: filter.entityType, value: filter.entityType }}
              onChange={(e: any) => {
                if (e === null) {
                  setFilter({ ...filter, entityType: "همه تراکنش ها" });
                } else {
                  setFilter({ ...filter, entityType: e.value });
                }
              }}
            />
            <span className="text-transaction">نوع تراکنش</span>
          </div>
          <div className="input-trip-financials">
            {filter.entityType === "هزینه سفر" && (
              <input
                type="text"
                placeholder="نام کوریر"
                value={filter.driver}
                onChange={(e: any) =>
                  setFilter({ ...filter, driver: e.target.value })
                }
              />
            )}
          </div>
          <div className="all-transactions">تمام تراکنش ها</div>
        </div>
      </div>
      <div className="item">
        {convertedData.map((item: output, i: number) => {
          return (
            <div className="item-content" key={i}>
              <div className="item-content-header">{item[0]?.cdf}</div>
              <div className="content">
                {item.map((subItem: any, j: number) => {
                  return (
                    <div key={j}>
                      <div>{subItem.time}</div>
                      <div className="trip-financials">
                        <div>{subItem.final_price}</div>
                        <div>{subItem.entityType}</div>
                      </div>
                      <div>{subItem.driver}</div>
                      <div>
                        {subItem.source_title
                          ? " کوریر:" + subItem.source_title
                          : ""}
                      </div>
                      <div className="border-bottom">
                        {subItem.hub ? "شعبه : " + subItem.hub.title : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
