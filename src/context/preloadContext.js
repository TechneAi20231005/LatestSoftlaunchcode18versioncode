import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState
} from 'react';

// // creating the context
export const PreLoadingContext = createContext();

// // creating a provider component
export const PreLoadingProvider = ({ children }) => {
  const [screenPreLoading, setScreenPreLoading] = useState(false);

  // // preloader
  useLayoutEffect(() => {
    setScreenPreLoading(true);
    setTimeout(() => {
      setScreenPreLoading(false);
    }, 2000);
  }, []);

  return (
    <PreLoadingContext.Provider
      value={{ screenPreLoading, setScreenPreLoading }}
    >
      {children}
    </PreLoadingContext.Provider>
  );
};

// // creating a hook to use the PreLoadingContext
export const usePreLoading = () => {
  return useContext(PreLoadingContext);
};
