import {
  AnyAction,
  ReducersMapObject,
  createStore,
  Reducer,
  combineReducers,
} from "redux";
import { reducer as DataReducer } from "./reducers/data";
import { StoreModel } from "./storeModel";

const reducers: ReducersMapObject<StoreModel, AnyAction> = {
  data: DataReducer as Reducer<StoreModel["data"], AnyAction>,
};
const combinedReducers = combineReducers(reducers);
export const store = createStore(combinedReducers);
