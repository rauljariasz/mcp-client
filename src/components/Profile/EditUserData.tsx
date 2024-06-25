import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import Input from '@components/common/Input';
import { ChangeEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import { onlyLettersAndNumbers } from '@/constants/regex';
import axios from 'axios';
import { useClient } from '@/hooks/useClient';
import { useNotify } from '@/hooks/useNotify';

interface EditProfileForm {
  name: string;
  last_name: string;
  username: string;
}

const EditUserData = () => {
  // Context
  const { userInfo, setUserInfo } = useAuth();
  const { isAccessExpired } = useClient();

  // States
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<EditProfileForm>({
    name: userInfo.name || '',
    last_name: userInfo.lastName || '',
    username: userInfo.username || '',
  });

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifySuccess } = useNotify();
  const emptyName = useEmptyInput(formData.name);
  const emptyLastName = useEmptyInput(formData.last_name);
  const emptyUsername = useEmptyInput(formData.username);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // *--------------* //
    // Prevalidaciones //
    // *------------* //

    if (name === 'name' || name === 'last_name') {
      if (value.length > 30) {
        return;
      }
    }

    // Nombre de usuario
    if (name === 'username') {
      if (!onlyLettersAndNumbers.test(value) || value.length > 20) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (onClose: () => void) => {
    setError('');
    setLoadingButton(true);
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh');

    try {
      await axios
        .put(`${import.meta.env.VITE_API_URL}client/editProfile`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            refresh_token: refreshToken,
          },
        })
        .then((res) => {
          const { last_name, name, username } = res.data.data;
          const { message } = res.data;

          setUserInfo({
            ...userInfo,
            lastName: last_name,
            name,
            username,
          });

          notifySuccess(message);

          onClose();
        });
    } catch (error) {
      const errorStatus = await isAccessExpired(error);
      if (errorStatus === 1) {
        if (axios.isAxiosError(error)) {
          const newToken = error.response?.headers['token'];
          localStorage.setItem('token', newToken);
          await handleSubmit(onClose);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message);
        }
      } else if (errorStatus === 3) {
        setError('Tu sesión ha caducado, vuelve a iniciar sesión');
      }
    } finally {
      setLoadingButton(false);
    }
  };

  // Función para validaciónes que habiliten el boton de iniciar sesión
  const isHandleSubmitEnable = () => {
    return !(
      (formData.name !== userInfo.name ||
        formData.last_name !== userInfo.lastName ||
        formData.username !== userInfo.username) &&
      formData.name.length > 2 &&
      formData.last_name.length > 2 &&
      formData.username.length > 3
    );
  };

  return (
    <div>
      <button
        onClick={onOpen}
        className='max-w-max flex items-center font-semibold text-primary'
      >
        Editar mis datos <MdKeyboardArrowRight className='w-5 h-5' />
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='center'
        backdrop='blur'
        classNames={{
          body: 'py-6',
          base: 'bg-secondary mx-6',
          header: 'border-b-[1px]',
          footer: 'border-t-[1px]',
          closeButton: 'hover:bg-white/5 active:bg-white/10',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Editar datos
              </ModalHeader>
              <ModalBody>
                {/* Nombre */}
                <Input
                  value={formData.name}
                  handleChange={handleChange}
                  label='Nombre'
                  type='text'
                  name='name'
                  error={
                    emptyName ||
                    (formData.name.length > 0 && formData.name.length < 2)
                  }
                />

                {/* Apellido */}
                <Input
                  value={formData.last_name}
                  handleChange={handleChange}
                  label='Apellido'
                  type='text'
                  name='last_name'
                  error={
                    emptyLastName ||
                    (formData.last_name.length > 0 &&
                      formData.last_name.length < 2)
                  }
                />

                {/* Apellido */}
                <Input
                  value={formData.username}
                  handleChange={handleChange}
                  label='Nombre de usuario'
                  type='text'
                  name='username'
                  error={
                    emptyUsername ||
                    (formData.username.length > 0 &&
                      formData.last_name.length < 3)
                  }
                />
              </ModalBody>
              <ModalFooter className='flex flex-col'>
                <div className='flex gap-2 justify-end'>
                  <Button
                    color='danger'
                    variant='flat'
                    className='text-white-p'
                    onPress={onClose}
                  >
                    Cerrar
                  </Button>
                  <Button
                    isLoading={loadingButton}
                    color='primary'
                    onPress={() => handleSubmit(onClose)}
                    isDisabled={isHandleSubmitEnable()}
                  >
                    Guardar cambios
                  </Button>
                </div>
                {error ? (
                  <p className='text-error font-semibold text-[12px] text-center'>
                    {error}
                  </p>
                ) : null}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditUserData;
