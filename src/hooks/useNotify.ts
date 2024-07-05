import { toast } from 'react-toastify';

export const useNotify = () => {
  const notifyError = (errorMessage: string, containerId?: string) =>
    toast.error(errorMessage, {
      position: 'top-center',
      draggablePercent: 50,
      containerId,
    });

  const notifySuccess = (errorMessage: string, containerId?: string) =>
    toast.success(errorMessage, {
      position: 'top-center',
      draggablePercent: 50,
      containerId,
    });

  return {
    notifyError,
    notifySuccess,
  };
};
