import Model, { ActionHandler } from "../src/Model";

interface TestState {
  data: string;
  pending: string[];
}

interface UpdateDataAction {
  type: "UPDATE_ACTION";
  payload: string;
}

interface AsyncUpdateDataAction {
  type: "ASYNC_UPDATE_ACTION";
  payload: string;
}

type TestAction = UpdateDataAction | AsyncUpdateDataAction;
type TestActionHandler = ActionHandler<TestState, TestAction>;

let n = 0;
const hashingFunction = (anything: TestState) => "hello" + ++n;

const handleUpdateData: TestActionHandler = (
  getState,
  action: TestAction,
  commit
) => {
  if (action.type === "UPDATE_ACTION") {
    const state = getState();
    commit({ ...state, data: action.payload });
  }
};

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

const { update, getState, setState } = new Model<TestState, TestAction>({
  hashingFunction: hashingFunction,
  initialState: { data: "", pending: [] },
  actionHandlers: [handleUpdateData, handleAsyncUpdateDate],
  onStateChanged: (getState) => console.log("NEW STATE", getState()),
});

update({ type: "UPDATE_ACTION", payload: "Hello World" });

// Will only trigger once since we are "rate limiting" it within the state/handler
update({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
update({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
update({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
update({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
update({ type: "ASYNC_UPDATE_ACTION", payload: "Other Data" });
