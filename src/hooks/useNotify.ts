import { toast } from 'react-toastify';

export const useNotify = () => {
  const notifyError = (errorMessage: string) =>
    toast.error(errorMessage, {
      position: 'top-center',
      draggablePercent: 50,
    });

  const notifySuccess = (errorMessage: string) =>
    toast.success(errorMessage, {
      position: 'top-center',
      draggablePercent: 50,
    });

  return {
    notifyError,
    notifySuccess,
  };
};
