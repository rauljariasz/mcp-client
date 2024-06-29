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
import ForgotPassword from './ForgotPassword/ForgotPassword';
import Profile from './Profile/Profile';
import AccessDenied from './AccessDenied/AccessDenied';
import { useData } from '@/hooks/useData';
import InitialLoad from './InitialLoad/InitialLoad';
import { useInitialLoad } from '@/hooks/useInitialLoad';
import Course from './Course/Course';

const AppRoutes = () => {
  // Hooks
  const { getDataUser, isAccessExpired } = useClient();
  const { getCourses } = useData();
  const { updateUserInfo, setIsAuthenticated, isAuthenticated } = useAuth();
  const { notifyError } = useNotify();
  const { initialLoad, setInitialLoad } = useInitialLoad();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');

    const promises = [];

    if (token && refresh) {
      promises.push(dataUser(token, refresh));
    }
    promises.push(getCourses());

    Promise.all(promises)
      .catch((error) => {
        console.error('Error loading data:', error);
      })
      .finally(() => {
        setInitialLoad(false);
      });

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
          {initialLoad ? (
            <>
              <Route path='*' element={<InitialLoad />} />
            </>
          ) : (
            <>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/pricing' element={<Pricing />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/course/:courseUrl' element={<Course />} />

              {/* Rutas autenticadas */}
              <Route
                path='/profile'
                element={isAuthenticated ? <Profile /> : <AccessDenied />}
              />
            </>
          )}
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
