import React, { createContext, useContext } from "react";
import { account, appwriteClient, databases } from "../services/appwrite";

const AppwriteContext = createContext({ account, databases, appwriteClient });

export const AppwriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppwriteContext.Provider value={{ account, appwriteClient, databases }}>
      {children}
    </AppwriteContext.Provider>
  );
};

export const useAppwrite = () => {
  return useContext(AppwriteContext);
};
