import React, { createContext, useState, useContext } from "react";

const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionContext() {
  return useContext(ConnectionContext);
}
