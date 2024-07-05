import { ROLES } from '@/types';
import { ChangeEvent, FormEvent, useState } from 'react';
import Input from '../common/Input';
import { MdOutlineEmail } from 'react-icons/md';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import { validateEmail } from '@/constants/regex';
import { FaSearch } from 'react-icons/fa';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { useClient } from '@/hooks/useClient';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import { FaEdit } from 'react-icons/fa';

const UsersSearch = () => {
  // States
  const [loadingButtonSearch, setLoadingButtonSearch] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    email: string;
  }>({
    email: '',
  });
  const [userFound, setUserFound] = useState<{
    email: string;
    role: ROLES;
  } | null>();

  const [userCurrentRole, setUserCurrentRole] = useState<string>('');
  const [loadingButtonChangeRole, setLoadingButtonChangeRole] =
    useState<boolean>(false);

  //   Hooks
  const emptyEmail = useEmptyInput(formData.email);
  const { isAccessExpired } = useClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifyError, notifySuccess } = useNotify();

  //   Functions
  // Función para controlar los valores de los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // *--------------* //
    // Prevalidaciones //
    // *------------* //

    // Correo
    if (name === 'email') {
      if (value.length > 250) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   Funcion para encontrar un usuario
  const handleSearchUser = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingButtonSearch(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    try {
      await axios
        .post(`${import.meta.env.VITE_API_URL}admin/getUser`, formData, {
          headers: {
            Authorization: `Bearer ${access}`,
            refresh_token: refresh,
          },
        })
        .then((res) => {
          const { data } = res.data;
          // Actualizamos los datos del usuario con la respuesta
          setUserFound(data);
          setUserCurrentRole(data.role);
          setLoadingButtonSearch(false);
        });
    } catch (error) {
      // Manejamos los diferentes errores
      const errorStatus = await isAccessExpired(error);
      if (errorStatus === 1) {
        if (axios.isAxiosError(error)) {
          const newToken = error.response?.headers['token'];
          localStorage.setItem('token', newToken);
          await handleSearchUser(e);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          notifyError(error.response?.data?.message);
          setLoadingButtonSearch(false);
        }
      } else if (errorStatus === 3) {
        notifyError('Tu sesión ha caducado, vuelve a iniciar sesión');
        setLoadingButtonSearch(false);
      }
    }
  };

  //   Funcion para cambiar la selección del rol del usuario
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (e: any) => {
    setUserCurrentRole(e.target.value);
  };

  //   Funcion para enviar la petición que cambia el rol del usuario
  const handleChangeUserRole = async (onClose: () => void) => {
    setLoadingButtonChangeRole(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    try {
      await axios
        .put(
          `${import.meta.env.VITE_API_URL}admin/editUserRole`,
          { email: userFound?.email, role: userCurrentRole },
          {
            headers: {
              Authorization: `Bearer ${access}`,
              refresh_token: refresh,
            },
          }
        )
        .then((res) => {
          const { data } = res.data;
          // Actualizamos los datos con la respuesta
          setUserFound(data);
          setUserCurrentRole(data.role);
          setLoadingButtonChangeRole(false);
          notifySuccess('Usuario editado correctamente.');
          onClose();
        });
    } catch (error) {
      // Manejamos los diferentes errores
      const errorStatus = await isAccessExpired(error);
      if (errorStatus === 1) {
        if (axios.isAxiosError(error)) {
          const newToken = error.response?.headers['token'];
          localStorage.setItem('token', newToken);
          await handleChangeUserRole(onClose);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          notifyError(error.response?.data?.message);
          setLoadingButtonChangeRole(false);
          onClose();
        }
      } else if (errorStatus === 3) {
        notifyError('Tu sesión ha caducado, vuelve a iniciar sesión');
        setLoadingButtonChangeRole(false);
        onClose();
      }
    }
  };

  const roles = ['PREMIUM', 'FREE'];

  return (
    <form
      onSubmit={handleSearchUser}
      className='md:w-1/2 bg-secondary py-4 px-4 rounded-2xl flex flex-col gap-4 max-h-[160px]'
    >
      {/* Email input */}
      <div className='flex items-center gap-3'>
        <Input
          value={formData.email}
          handleChange={handleChange}
          type='email'
          name='email'
          required={true}
          label='Correo electronico'
          error={
            emptyEmail ||
            (formData.email.length > 0 && !validateEmail(formData.email))
              ? true
              : false
          }
          icon={<MdOutlineEmail className='w-[30px] h-[30px]' />}
        />

        {/* Buscar usuario */}
        <Button
          isLoading={loadingButtonSearch}
          type='submit'
          color='primary'
          className='disabled:bg-neutral min-w-[20px]'
          disabled={!validateEmail(formData.email)}
        >
          {!loadingButtonSearch && <FaSearch className='w-4 h-4' />}
        </Button>
      </div>

      {/* Usuario encontrado */}
      {userFound ? (
        <div className='flex justify-between'>
          <div>
            <p className='font-semibold text-warm'>{userFound.email}</p>
            <p className='text-primary font-bold'>{userFound.role}</p>
          </div>

          {/* Boton Editar Rol */}
          <Button
            type='button'
            color='primary'
            className='disabled:bg-neutral min-w-[16px] p-2'
            onPress={onOpen}
          >
            <FaEdit className='w-5 h-5' />
          </Button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop='blur'
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1 text-primary'>
                    Editar usuario
                  </ModalHeader>
                  <ModalBody>
                    <Select
                      label='Rol'
                      variant='bordered'
                      placeholder='Select an animal'
                      selectedKeys={[userCurrentRole]}
                      className='max-w-xs'
                      onChange={handleSelectionChange}
                    >
                      {roles.map((rol) => (
                        <SelectItem key={rol}>{rol}</SelectItem>
                      ))}
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className='bg-error/30 text-error'
                      onPress={onClose}
                      type='button'
                    >
                      Cerrar
                    </Button>
                    <Button
                      isLoading={loadingButtonChangeRole}
                      color='primary'
                      type='button'
                      onPress={() => handleChangeUserRole(onClose)}
                      isDisabled={userCurrentRole === userFound.role}
                    >
                      Cambiar rol
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : (
        <p className='text-gray-400 text-[12px] text-center'>
          Busca un usuario para editar su rol.
        </p>
      )}
    </form>
  );
};

export default UsersSearch;
