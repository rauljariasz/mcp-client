import SearchQuantityUser from '@/components/Dashboard/SearchQuantityUser';
import { useClient } from '@/hooks/useClient';
import { useNotify } from '@/hooks/useNotify';
import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface UsersQuantityInterface {
  free: number;
  premium: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [usersQuantity, setUserQuantity] = useState<UsersQuantityInterface>({
    free: 0,
    premium: 0,
  });

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
          const { data } = res;
          setUserQuantity(data.data);
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
    return (
      <main className='main-container flex-center'>
        <Spinner size='lg' color='primary'></Spinner>
      </main>
    );
  }

  return (
    <main className='main-container py-4 md:py-8'>
      {/* Buscar usuario & Cantidad de usuarios */}
      <SearchQuantityUser usersQuantity={usersQuantity} />
    </main>
  );
};

export default Dashboard;
