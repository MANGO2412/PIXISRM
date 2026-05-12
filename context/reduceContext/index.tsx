import {reducer,initialState} from "@/context/reduceContext/reducer"
import {createContext,useReducer} from "react"

export const GlobalContext = createContext<{
    state: typeof initialState,
    dispatch: React.Dispatch<any>
}>({
    state: initialState,
    dispatch: () => null
})

export const GlobalProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};