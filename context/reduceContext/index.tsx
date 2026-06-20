import {reducer,initialState} from "@/context/reduceContext/reducer"
import {createContext,useReducer,useMemo} from "react"

export const GlobalContext = createContext<{
    state: typeof initialState,
    dispatch: React.Dispatch<any>
}>({
    state: initialState,
    dispatch: () => null
})

export const GlobalProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const contextValue = useMemo(() => ({ state, dispatch }), [state]);
    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
};