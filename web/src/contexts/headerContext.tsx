import { ReactNode, createContext, useContext, useState } from "react";

export type IHeaderContext = [
  string,
  React.Dispatch<React.SetStateAction<string>>,
];

const DataContext = createContext<IHeaderContext>(["", () => null]);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<string>("MUN HUB");

  return (
    <DataContext.Provider value={[header, setHeader]}>
      {children}
    </DataContext.Provider>
  );
}

export function useHeader() {
  return useContext(DataContext);
}
