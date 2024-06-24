import axios from 'axios';
import { useAuth } from './useAuth';

export const useClient = () => {
  // Hooks
  const { logout } = useAuth();

  // *---------------------* //
  // Peticiones a serviciós //
  // *-------------------* //
  const getDataUser = async (accessToken: string, refreshToken: string) => {
    return await axios.get(
      `${import.meta.env.VITE_API_URL}client/getDataUser`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          refresh_token: refreshToken,
        },
      }
    );
  };

  //   Función para saber si es un error de Axios y 403 para repetir la petición con el nuevo accessToken
  const isAccessExpired = async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const token = error.response?.headers['token'];

      if (token) {
        if (error.response?.status === 403) {
          // Si el codigo es 403 retornamos true para saber que debemos hacer la petición nuevamente
          return 1;
        } else {
          // Si el codigo es diferente a 403, retornamos false para ejecutrar la logica correspondiente
          return 2;
        }
      } else {
        // En los demas casos devolvemos 3, no tenemos que hacer nada
        // Cerrar sesión
        logout();
        return 3;
      }
    } else {
      // Cerrar sesión
      logout();
      return 3;
    }
  };

  return {
    getDataUser,
    isAccessExpired,
  };
};
