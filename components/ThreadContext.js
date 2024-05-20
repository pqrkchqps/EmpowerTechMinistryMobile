import { createContext, useState } from "react";

export const ThreadContext = createContext()

export function ThreadProvider({children}){
    const [socketThread, setSocketThread] = useState(null);
    const [threadId, setThreadId] = useState(null);

    return (
        <ThreadContext.Provider value={{socketThread, setSocketThread, threadId, setThreadId}}>
            {children}
        </ThreadContext.Provider>
    )
}