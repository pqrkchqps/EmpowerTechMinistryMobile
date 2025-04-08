import { createContext, useState } from "react";

export const ArticleContext = createContext()

export function ArticleProvider({children}){
    const [socketArticles, setSocketArticles] = useState(null);
    const [articleId, setArticleId] = useState(null);

    return (
      <ArticleContext.Provider
        value={{socketArticles, setSocketArticles, articleId, setArticleId}}>
        {children}
      </ArticleContext.Provider>
    );
}