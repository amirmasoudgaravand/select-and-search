import { ReduxActions } from "../reduxActions";
import { StoreModel } from "../storeModel";

export function reducer(
  preState: StoreModel["data"],
  action: { type: ReduxActions; payload: StoreModel["data"] }
): StoreModel["data"] {
  switch (action.type) {
    case ReduxActions.setData:
      return action.payload;
    default:
      return null;
  }
}
