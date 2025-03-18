import { createContext, useState } from "react";

export const ArticleContext = createContext()

export function ArticleProvider({children}){
    const [socketArticle, setSocketArticle] = useState(null);
    const [articleId, setArticleId] = useState(null);

    return (
        <ArticleContext.Provider value={{socketArticle, setSocketArticle, articleId, setArticleId}}>
            {children}
        </ArticleContext.Provider>
    )
}