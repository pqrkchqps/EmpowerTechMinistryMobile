import { createContext, useState } from "react";

export const RouteContext = createContext()

export function RouteProvider({children}){
    const [routeName, setRouteName] = useState(null);
    const [routeParams, setRouteParams] = useState(null);

    function resetRouteVars() {
        setRouteName(null)
        setRouteParams(null)
    }
    return (
        <RouteContext.Provider value={{routeName, routeParams, setRouteName, setRouteParams, resetRouteVars}}>
            {children}
        </RouteContext.Provider>
    )
}