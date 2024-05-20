import { createContext, useState } from "react";

export const CommentContext = createContext()

export function CommentProvider({children}){
    const [socketComment, setSocketComment] = useState(null);
    const [scrollToId, setScrollToId] = useState(null);

    return (
        <CommentContext.Provider value={{socketComment, setSocketComment, scrollToId, setScrollToId}}>
            {children}
        </CommentContext.Provider>
    )
}