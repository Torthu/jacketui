import { Store, ActionHandler } from "../";

interface TestState {
  data: string;
  pending: string[];
}

type TestAction =
  | {
      type: "UPDATE_ACTION";
      payload: string;
    }
  | {
      type: "ASYNC_UPDATE_ACTION";
      payload: string;
    };

type TestActionHandler = ActionHandler<TestState, TestAction>;

/**
 * Illustrates a sync action handler
 * This works exactly like the reducer in e.g React useReducer
 */
const handleUpdateData: TestActionHandler = (state, action) => {
  if (action.type === "UPDATE_ACTION") {
    return { ...state, data: action.payload };
  }
};

/**
 * Illustrates an async action handler
 * This one also illustrates a "rate limiting" pattern
 */
const handleAsyncUpdateDate: TestActionHandler = (getState, action, commit) => {
  const state = getState();
  if (
    action.type === "ASYNC_UPDATE_ACTION" &&
    !state.pending.find((str) => str === "ASYNC_UPDATE_ACTION")
  ) {
    commit({ ...getState(), pending: ["ASYNC_UPDATE_ACTION"] });
    console.log(action.type);
    setTimeout(() => {
      console.log("NOW COMMITING NEW DATA");
      const state = getState();
      commit({ ...state, data: action.payload, pending: [] });
    }, 1000);
  }
};

/**
 * Initialze the store with the two action handlers defined above
 */
const { dispatch, getState, setState } = new Store<TestState, TestAction>({
  initialState: { data: "", pending: [] },
  actionHandlers: [handleUpdateData, handleAsyncUpdateDate],
  onStateChanged: (getState) => console.log("NEW STATE", getState()),
});

dispatch({ type: "UPDATE_ACTION", payload: "Hello World" });

// Will only trigger once since we are "rate limiting" it within the state/handler
dispatch({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
dispatch({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
dispatch({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
dispatch({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
dispatch({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
