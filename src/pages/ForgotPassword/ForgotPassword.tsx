import Input from '@/components/common/Input';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { ChangeEvent, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import { MdArrowForwardIos, MdOutlineEmail } from 'react-icons/md';
import { validateEmail } from '@/constants/regex';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import InputPassword from '@/components/common/InputPassword';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordForm {
  email: string;
  password: string;
  code: string;
}

const ForgotPassword = () => {
  // States
  const [formData, setFormData] = useState<ForgotPasswordForm>({
    email: '',
    password: '',
    code: '',
  });
  const [stepSelected, setStepSelected] = useState<string>('stepOne');
  const [step, setStep] = useState<string[]>(['stepTwo']);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  //   Hooks
  const emptyEmail = useEmptyInput(formData.email);
  const emptyPassword = useEmptyInput(formData.password);
  const emptyCode = useEmptyInput(formData.code);
  const { notifyError, notifySuccess } = useNotify();
  const { resendCode } = useAuth();
  const navigate = useNavigate();

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

    if (name === 'code') {
      if (value.length > 6) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   Función que envia la petición para recibir el codigo
  const forgotPassword = async () => {
    setLoadingButton(true);

    try {
      await axios
        .post(`${import.meta.env.VITE_API_URL}auth/forgotPassword`, formData)
        .then(() => {
          notifySuccess(
            'Hemos enviado un correo con el código de verificación.'
          );
          setStepSelected('stepTwo');
          setStep(['stepOne']);
        });
    } catch (error) {
      // Validamos si es un error de axios
      if (axios.isAxiosError(error)) {
        // Si del back se recibe un message, se muestra.
        if (error.response?.data?.message) {
          notifyError(error.response?.data?.message);
        } else {
          notifyError('Ha ocurrido un error, por favor intenta mas tarde.');
        }
      } else {
        // Error generico
        notifyError('Ha ocurrido un error, por favor intenta mas tarde.');

        console.log(error);
      }
    } finally {
      setLoadingButton(false);
    }
  };

  // Función para reenviar el codigo de verificación
  const resendEmail = async () => {
    // Si por algun motivo el email ya no existe, se redirige al login
    if (!formData.email) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      await resendCode(formData.email).then((res) => {
        notifySuccess(res.data.message);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          notifyError(error.response?.data?.message);
        } else {
          notifyError('Ha ocurrido un error, por favor intenta mas tarde.');
        }
      } else {
        notifyError('Ha ocurrido un error, por favor intenta mas tarde.');
      }
    }
  };

  // Función para validaciónes que habiliten el boton de iniciar sesión
  const isHandleSubmitEnable = () => {
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasMinLength = formData.password.length >= 8;

    return !(
      hasUpperCase &&
      hasNumber &&
      hasMinLength &&
      formData.code.length === 6
    );
  };

  //   Función para enviar el cambio de contraseña
  const recoveryPassword = async () => {
    setLoadingButton(true);

    const data = {
      email: formData.email,
      password: formData.password,
      verification_code: formData.code,
    };
    try {
      await axios
        .post(`${import.meta.env.VITE_API_URL}auth/recoveryPassword`, data)
        .then(() => {
          notifySuccess('Has actualizado tu contraseña correctamente.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        });
    } catch (error) {
      // Validamos si es un error de axios
      if (axios.isAxiosError(error)) {
        // Si del back se recibe un message, se muestra.
        if (error.response?.data?.message) {
          notifyError(error.response?.data?.message);
        } else {
          notifyError('Ha ocurrido un error, por favor intenta mas tarde.');
        }
      } else {
        // Error generico
        notifyError('Ha ocurrido un error, por favor intenta mas tarde.');

        console.log(error);
      }
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <main className='main-container flex-center py-6'>
      <ToastContainer theme='colored' draggable className='md:w-[600px]' />
      <form className='flex flex-col items-center w-full max-w-[380px] gap-4 px-6 py-8 rounded-2xl bg-secondary transition-all'>
        {/* LOGO */}
        <section className='flex text-[26px]'>
          <h2 className='text-primary font-bold text-inherit'>MCP</h2>
          <span className='text-white-p'>PLATFORM</span>
        </section>

        {/* Tab */}
        <Tabs
          disabledKeys={step}
          color='primary'
          selectedKey={stepSelected}
          classNames={{
            tabList: 'bg-black-p',
          }}
        >
          <Tab key='stepOne' title='Ingresa tu correo'></Tab>
          <Tab key='stepTwo' title='Cambiar contraseña'></Tab>
        </Tabs>

        {/* Email Input / cambio de contraseña */}
        {stepSelected === 'stepOne' ? (
          <section className='w-full flex flex-col gap-3 items-center'>
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

            {/* Iniciar sesión */}
            <Button
              isLoading={loadingButton}
              type='button'
              color='primary'
              onClick={() => forgotPassword()}
              className='w-full max-w-[200px] disabled:bg-neutral'
              disabled={!validateEmail(formData.email)}
            >
              Continuar
            </Button>
          </section>
        ) : (
          <section className='w-full flex flex-col gap-3 items-center'>
            <Input
              value={formData.code}
              handleChange={handleChange}
              type='text'
              name='code'
              required={true}
              label='Código de confirmación'
              error={
                emptyCode ||
                (formData.code.length > 0 && formData.code.length < 6)
                  ? true
                  : false
              }
            />

            {/* Password Input */}
            <InputPassword
              value={formData.password}
              handleChange={handleChange}
              label='Contraseña'
              name='password'
              required={true}
              requeriments={true}
              firstInput={
                (!emptyPassword && formData.password.length > 0) ||
                emptyPassword
              }
              error={
                emptyPassword ||
                (formData.password.length > 0 && formData.password.length < 8)
              }
            />

            {/* Cambiar contraseña */}
            <Button
              isLoading={loadingButton}
              type='button'
              color='primary'
              onClick={() => recoveryPassword()}
              className='w-full max-w-[200px] disabled:bg-neutral'
              disabled={isHandleSubmitEnable()}
            >
              Cambiar contraseña
            </Button>

            <div className='text-[12px] font-semibold flex gap-2'>
              ¿No te llego correo electronico?{' '}
              <button
                type='button'
                onClick={resendEmail}
                className='flex items-center gap-0.5 text-primary'
              >
                Reenviar <MdArrowForwardIos />
              </button>
            </div>
          </section>
        )}
      </form>
    </main>
  );
};

export default ForgotPassword;
