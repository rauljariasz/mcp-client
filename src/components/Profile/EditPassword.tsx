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
import { ChangeEvent, useState } from 'react';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import axios from 'axios';
import { useClient } from '@/hooks/useClient';
import { useNotify } from '@/hooks/useNotify';
import InputPassword from '../common/InputPassword';

interface EditProfileForm {
  password: string;
  newPassword: string;
}

const EditPassword = () => {
  // Context
  const { isAccessExpired } = useClient();

  // States
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<EditProfileForm>({
    password: '',
    newPassword: '',
  });

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifySuccess } = useNotify();
  const emptyPassword = useEmptyInput(formData.password);
  const emptyNewPassword = useEmptyInput(formData.newPassword);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // *--------------* //
    // Prevalidaciones //
    // *------------* //

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

    const data = {
      password: formData.password,
      new_password: formData.newPassword,
    };

    try {
      await axios
        .put(`${import.meta.env.VITE_API_URL}client/editPassword`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            refresh_token: refreshToken,
          },
        })
        .then((res) => {
          const { message } = res.data;

          notifySuccess(message);
          setFormData({
            password: '',
            newPassword: '',
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
    const hasUpperCase = /[A-Z]/.test(formData.newPassword);
    const hasNumber = /[0-9]/.test(formData.newPassword);
    return !(
      formData.password.length > 7 &&
      formData.password.length > 7 &&
      hasUpperCase &&
      hasNumber
    );
  };

  return (
    <div>
      <button
        onClick={onOpen}
        className='max-w-max flex items-center font-semibold text-primary'
      >
        Editar contraseña <MdKeyboardArrowRight className='w-5 h-5' />
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
                Editar contraseña
              </ModalHeader>
              <ModalBody>
                {/* Contraseña actual */}
                <InputPassword
                  value={formData.password}
                  handleChange={handleChange}
                  label='Contraseña actual'
                  name='password'
                  required={true}
                  error={
                    emptyPassword ||
                    (formData.password.length > 0 &&
                      formData.password.length < 8)
                  }
                />

                {/* Contraseña nueva */}
                {/* Password Input */}
                <InputPassword
                  value={formData.newPassword}
                  handleChange={handleChange}
                  label='Nueva contraseña'
                  name='newPassword'
                  required={true}
                  requeriments={true}
                  firstInput={
                    (!emptyNewPassword && formData.newPassword.length > 0) ||
                    emptyNewPassword
                  }
                  error={
                    emptyNewPassword ||
                    (formData.newPassword.length > 0 &&
                      formData.newPassword.length < 8)
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

export default EditPassword;
