import { createContext, useState } from "react";

export const CommentContext = createContext()

export function CommentProvider({children}){
    const [socketComments, setSocketComments] = useState(null);
    const [scrollToId, setScrollToId] = useState(null);

    return (
      <CommentContext.Provider
        value={{socketComments, setSocketComments, scrollToId, setScrollToId}}>
        {children}
      </CommentContext.Provider>
    );
}