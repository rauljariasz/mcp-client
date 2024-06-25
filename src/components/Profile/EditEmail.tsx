import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { MdKeyboardArrowRight, MdOutlineEmail } from 'react-icons/md';
import Input from '@components/common/Input';
import { ChangeEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import { validateEmail } from '@/constants/regex';
import axios from 'axios';
import { useClient } from '@/hooks/useClient';
import { useNotify } from '@/hooks/useNotify';
import InputPassword from '../common/InputPassword';

interface EditProfileForm {
  email: string;
  password: string;
}

const EditEmail = () => {
  // Context
  const { userInfo, setUserInfo } = useAuth();
  const { isAccessExpired } = useClient();

  // States
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<EditProfileForm>({
    email: userInfo.email || '',
    password: '',
  });

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifySuccess } = useNotify();
  const emptyEmail = useEmptyInput(formData.email);
  const emptyPassword = useEmptyInput(formData.password);

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

  const handleSubmit = async (onClose: () => void) => {
    setError('');
    setLoadingButton(true);
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh');

    try {
      await axios
        .put(`${import.meta.env.VITE_API_URL}client/editEmail`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            refresh_token: refreshToken,
          },
        })
        .then((res) => {
          const { email } = res.data.data;
          const { message } = res.data;

          setUserInfo({
            ...userInfo,
            email,
          });

          notifySuccess(message);
          setFormData({
            ...formData,
            password: '',
          });

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
    return !(validateEmail(formData.email) && formData.password.length > 7);
  };

  return (
    <div>
      <button
        onClick={onOpen}
        className='max-w-max flex items-center font-semibold text-primary'
      >
        Editar correo electronico <MdKeyboardArrowRight className='w-5 h-5' />
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
                Editar correo electronico
              </ModalHeader>
              <ModalBody>
                {/* Email */}
                <Input
                  value={formData.email}
                  handleChange={handleChange}
                  type='email'
                  name='email'
                  required={true}
                  label='Correo electronico'
                  error={
                    emptyEmail ||
                    (formData.email.length > 0 &&
                      !validateEmail(formData.email))
                      ? true
                      : false
                  }
                  icon={<MdOutlineEmail className='w-[30px] h-[30px]' />}
                />

                <InputPassword
                  value={formData.password}
                  handleChange={handleChange}
                  label='Contraseña'
                  name='password'
                  required={true}
                  error={
                    emptyPassword ||
                    (formData.password.length > 0 &&
                      formData.password.length < 8)
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

export default EditEmail;
