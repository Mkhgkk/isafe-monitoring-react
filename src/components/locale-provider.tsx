import { createContext, useContext, useEffect, useState } from "react";
import i18n from "@/locale/i18n";

type Locale = "en" | "ko";

type LocaleProviderProps = {
  children: React.ReactNode;
  defaultLocale?: Locale;
  storageKey?: string;
};

type LocaleProviderState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const initialState: LocaleProviderState = {
  locale: "en",
  setLocale: () => null,
};

const LocaleProviderContext = createContext<LocaleProviderState>(initialState);

export function LocaleProvider({
  children,
  defaultLocale = "en",
  storageKey = "isafe-locale",
  ...props
}: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(
    () => (localStorage.getItem(storageKey) as Locale) || defaultLocale
  );

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  const value = {
    locale,
    setLocale: (locale: Locale) => {
      localStorage.setItem(storageKey, locale);
      setLocale(locale);
    },
  };

  return (
    <LocaleProviderContext.Provider {...props} value={value}>
      {children}
    </LocaleProviderContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(LocaleProviderContext);

  if (context === undefined)
    throw new Error("useLocale must be used within a LocaleProvider");

  return context;
};
