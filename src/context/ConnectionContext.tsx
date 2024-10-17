import {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";

interface ConnectionContextType {
  isConnected: boolean;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
}

const ConnectionContext = createContext<ConnectionContextType>({
  isConnected: false,
  setIsConnected: () => {},
});

export function ConnectionProvider({ children }: PropsWithChildren) {
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
