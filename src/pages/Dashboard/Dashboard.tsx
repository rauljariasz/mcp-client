import { useClient } from '@/hooks/useClient';
import { useNotify } from '@/hooks/useNotify';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const { isAccessExpired } = useClient();
  const { notifyError } = useNotify();

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('token');

    if (!accessToken || !refreshToken) {
      return;
    }
    getTotalUsers(accessToken, refreshToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Funcion para obtener los datos del usuario
  const getTotalUsers = async (token: string, refresh: string) => {
    try {
      await axios
        .get(`${import.meta.env.VITE_API_URL}admin/getTotalUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            refresh_token: refresh,
          },
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
        });
    } catch (error) {
      const errorStatus = await isAccessExpired(error);
      if (errorStatus === 1) {
        if (axios.isAxiosError(error)) {
          const newToken = error.response?.headers['token'];
          localStorage.setItem('token', newToken);
          await getTotalUsers(newToken, refresh);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          notifyError(error.response?.data?.message);
        }
      } else if (errorStatus === 3) {
        notifyError('Tu sesión ha caducado, vuelve a iniciar sesión');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <main className='main-container'>Cargando</main>;
  }

  return <main className='main-container'>Dashboard</main>;
};

export default Dashboard;
