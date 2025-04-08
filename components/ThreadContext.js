import { createContext, useState } from "react";

export const ThreadContext = createContext()

export function ThreadProvider({children}){
    const [socketThreads, setSocketThreads] = useState(null);
    const [threadId, setThreadId] = useState(null);

    return (
      <ThreadContext.Provider
        value={{socketThreads, setSocketThreads, threadId, setThreadId}}>
        {children}
      </ThreadContext.Provider>
    );
}