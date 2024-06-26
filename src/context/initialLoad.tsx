import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

interface InitialLoadContextType {
  initialLoad: boolean;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
}

interface InitialLoadProviderProps {
  children: ReactNode;
}

export const InitialLoadContext = createContext<
  InitialLoadContextType | undefined
>(undefined);

export function InitialLoadProvider({ children }: InitialLoadProviderProps) {
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  return (
    <InitialLoadContext.Provider
      value={{
        initialLoad,
        setInitialLoad,
      }}
    >
      {children}
    </InitialLoadContext.Provider>
  );
}
