import { ChangeEvent, FormEvent, useState } from 'react';
import Input from '@/components/common/Input';
import { Button } from '@nextui-org/react';
import { MdArrowForwardIos } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Verify = () => {
  // States
  const [code, setCode] = useState<string>('');
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  // Hooks
  const { resendCode, verify, updateUserInfo, setIsAuthenticated } = useAuth();
  const { notifyError, notifySuccess } = useNotify();
  const navigate = useNavigate();

  // Funcion para controlar el input
  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 6) {
      return;
    }
    setCode(value);
  };

  // Función para reenviar el codigo de verificación
  const resendEmail = async () => {
    const email = sessionStorage.getItem('verify');

    // Si por algun motivo el email ya no existe, se redirige al login
    if (!email) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      await resendCode(email).then((res) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingButton(true);
    const email = sessionStorage.getItem('verify');

    try {
      await verify({
        email,
        verification_code: code,
      }).then((res) => {
        notifySuccess('Verificación exitosa.');
        setTimeout(() => {
          updateUserInfo(res.data.data);
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('refresh', res.data.data.refresh);
          setIsAuthenticated(true);
          navigate('/', { replace: true });
        }, 2500);
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
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <main className='main-container flex-center'>
      <ToastContainer theme='colored' draggable className='md:w-[600px]' />
      <form
        className='flex flex-col items-center w-full max-w-[380px] gap-4 px-6 py-8 rounded-2xl bg-secondary transition-all'
        onSubmit={handleSubmit}
      >
        {/* LOGO */}
        <section className='flex text-[26px]'>
          <h2 className='text-primary font-bold text-inherit'>MCP</h2>
          <span className='text-white-p'>PLATFORM</span>
        </section>

        {/*  */}
        <p className='mb-[56px] text-center'>
          Verifica tu correo electronico para tener acceso a nuestra plataforma.
        </p>

        {/* code input */}
        <Input
          value={code}
          handleChange={handleCodeChange}
          type='text'
          name='code'
          required={true}
          label='Codigo de verificación'
          error={false}
        />

        {/* Iniciar sesión */}
        <Button
          isLoading={loadingButton}
          type='submit'
          color='primary'
          className='w-full max-w-[200px] disabled:bg-neutral'
          disabled={code.length < 6}
        >
          Verificar
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
      </form>
    </main>
  );
};

export default Verify;
