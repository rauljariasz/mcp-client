import { useContext } from 'react';
import axios from 'axios';
import { LoginForm as LoginTypes, ROLES } from '@/types';
import { AuthContext } from '@context/auth';
import { User } from '@/types';

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const isAuthenticated = authContext.isAuthenticated;

  const setIsAuthenticated = (newState: boolean) => {
    authContext.setIsAuthenticated(newState);
  };

  const userInfo = authContext.userInfo;

  const updateUserInfo = (data: User) => {
    const { setUserInfo } = authContext;
    setUserInfo({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      username: data.username,
      viewedClasses: data.viewedClasses,
    });
  };

  const logout = () => {
    authContext.setUserInfo({
      name: '',
      lastName: '',
      username: '',
      email: '',
      role: ROLES.FREE,
      viewedClasses: [],
    });

    authContext.setIsAuthenticated(false);

    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  };

  // *---------------------* //
  // Peticiones a serviciós //
  // *-------------------* //
  const login = async (formData: LoginTypes) => {
    return await axios.post(
      `${import.meta.env.VITE_API_URL}auth/login`,
      formData
    );
  };

  const resendCode = async (email: string) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}auth/resendCode`, {
      email,
    });
  };

  const verify = async (payload: unknown) => {
    return await axios.post(
      `${import.meta.env.VITE_API_URL}auth/verify`,
      payload
    );
  };

  return {
    userInfo,
    updateUserInfo,
    isAuthenticated,
    setIsAuthenticated,
    login,
    resendCode,
    verify,
    logout,
  };
};
