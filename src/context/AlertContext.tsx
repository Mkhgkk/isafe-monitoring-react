import {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import sound from "@/assets/alert.wav";

interface AlertContextType {
  playAlert: () => void;
}

const AlertContext = createContext<AlertContextType>({
  playAlert: () => {},
});

export function AlertProvider({ children }: PropsWithChildren) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(sound));

  useEffect(() => {
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const playAlert = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <AlertContext.Provider value={{ playAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
