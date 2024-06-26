import { InitialLoadContext } from '@/context/initialLoad';
import { useContext } from 'react';

export const useInitialLoad = () => {
  const initialLoadContext = useContext(InitialLoadContext);
  if (!initialLoadContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { initialLoad, setInitialLoad } = initialLoadContext;

  return {
    initialLoad,
    setInitialLoad,
  };
};
