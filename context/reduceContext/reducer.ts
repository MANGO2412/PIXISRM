import {PlayList} from "@/interface/playlist"

enum ReducerActionType {
  SET_RESULTS = "SET_RESULTS",
  SET_QUERY = "SET_QUERY",
  SET_PLAYLIST="SET_PLAYLIST"
}
interface ReducerAction {
  type: ReducerActionType;
  payload: any;
}

interface ReducerState {
  results: string[];
  query?: string;
  playlist?:PlayList[]
}

export const reducer= (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case ReducerActionType.SET_RESULTS:
        // return { ...state, results: [...state.results, ...action.payload] };
        return { ...state, results: action.payload };
    case ReducerActionType.SET_QUERY:
        return { ...state, query: action.payload };
    case ReducerActionType.SET_PLAYLIST:
        return {...state,playlist:action.payload}
    default:
      return state;
  }
};

export const initialState: ReducerState = {
  results: [],
};