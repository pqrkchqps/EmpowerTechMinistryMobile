import React, {useContext, useEffect} from "react";
import {useNavigation} from "@react-navigation/native"
import {RouteContext} from "./RouteContext"

function RedirectNavigator({children}){
    const navigation = useNavigation()
    const {routeName, routeParams, resetRouteVars} = useContext(RouteContext)
    useEffect(()=>{
        if (routeName){
            setTimeout(()=>resetRouteVars(), 1000)
            if (routeName == "Talk Details"){
                navigation.navigate('Talk', {
                  screen: routeName,
                  params: routeParams,
                });
            } else {
                navigation.navigate(routeName, routeParams)    
            }
        }
    },[routeName])

    return children;
}

export default RedirectNavigator;