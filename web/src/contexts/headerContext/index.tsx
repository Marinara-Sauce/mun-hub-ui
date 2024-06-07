import { ReactNode, createContext, useContext, useState } from "react";

export type IHeaderContext = {
  header: string;
  setHeader: React.Dispatch<React.SetStateAction<string>>,
};

const DataContext = createContext<IHeaderContext>({
  header: "", 
  setHeader: () => {}
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<string>("Tiger MUN HUB");

  return (
    <DataContext.Provider value={{header, setHeader}}>
      {children}
    </DataContext.Provider>
  );
}

export function useHeader() {
  return useContext(DataContext);
}
