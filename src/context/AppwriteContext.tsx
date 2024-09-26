import React, { createContext, useContext } from "react";
import { account, appwriteClient } from "../services/appwrite";

const AppwriteContext = createContext({ account, appwriteClient });

export const AppwriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AppwriteContext.Provider value={{ account, appwriteClient }}>
      {children}
    </AppwriteContext.Provider>
  );
};

export const useAppwrite = () => {
  return useContext(AppwriteContext);
};
