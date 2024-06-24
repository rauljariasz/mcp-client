import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Register from './Register/Register';
import Layout from '../layout/Layout';
import Pricing from './Pricing/Pricing';
import Contact from './Contact/Contact';
import Login from './Login/Login';
import Verify from './Verify/Verify';
import { useClient } from '@/hooks/useClient';
import { useAuth } from '@/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';

const AppRoutes = () => {
  // Hooks
  const { getDataUser, isAccessExpired } = useClient();
  const { updateUserInfo, setIsAuthenticated } = useAuth();
  const { notifyError } = useNotify();

  // Efecto para loguear usuario.
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    if (token && refresh) {
      dataUser(token, refresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Funcion para obtener los datos del usuario
  const dataUser = async (token: string, refresh: string) => {
    try {
      await getDataUser(token, refresh).then((res) => {
        const { data } = res.data;
        updateUserInfo(data);
        setIsAuthenticated(true);
      });
    } catch (error) {
      const errorStatus = await isAccessExpired(error);
      if (errorStatus === 1) {
        if (axios.isAxiosError(error)) {
          const newToken = error.response?.headers['token'];
          localStorage.setItem('token', newToken);
          await dataUser(newToken, refresh);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          notifyError(error.response?.data?.message);
        }
      } else if (errorStatus === 3) {
        notifyError('Tu sesión ha caducado, vuelve a iniciar sesión');
      }
    }
  };

  return (
    <>
      <ToastContainer theme='colored' draggable className='md:w-[600px]' />
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/verify' element={<Verify />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
