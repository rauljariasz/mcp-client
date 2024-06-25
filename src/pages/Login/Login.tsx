import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import { Button } from '@nextui-org/react';
import Input from '@components/common/Input';
import InputPassword from '@components/common/InputPassword';
import { validateEmail } from '@constants/regex';
import { useEmptyInput } from '@hooks/useEmptyInput';
import { LoginForm as LoginTypes } from '@/types';
import { useAuth } from '@hooks/useAuth';
import { MdArrowForwardIos } from 'react-icons/md';
import { useNotify } from '@hooks/useNotify';

const Login = () => {
  // States
  const [formData, setFormData] = useState<LoginTypes>({
    email: '',
    password: '',
  });
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  // Hooks
  const emptyEmail = useEmptyInput(formData.email);
  const emptyPassword = useEmptyInput(formData.password);
  const navigate = useNavigate();
  const { login, updateUserInfo, setIsAuthenticated } = useAuth();
  const { notifyError } = useNotify();

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

  // Función para validaciónes que habiliten el boton de iniciar sesión
  const isHandleSubmitEnable = () => {
    return !validateEmail(formData.email) || formData.password.length < 8;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      await login(formData).then((res) => {
        const { data } = res.data;
        updateUserInfo(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh', data.refresh);
        setIsAuthenticated(true);
        navigate('/', { replace: true });
      });
    } catch (error: unknown) {
      // Validamos si es un error de axios
      if (axios.isAxiosError(error)) {
        // Si el error es 401, redireccionamos a la vista de validación
        if (error.response?.status === 401) {
          sessionStorage.setItem('verify', formData.email);
          navigate('/verify');
        } else {
          // Si del back se recibe un message, se muestra.
          if (error.response?.data?.message) {
            notifyError(error.response?.data?.message);
          } else {
            notifyError('Ha ocurrido un error, por favor intenta mas tarde.');
          }
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
      <form
        className='flex flex-col items-center w-full max-w-[380px] gap-4 px-6 py-8 rounded-2xl bg-secondary transition-all'
        onSubmit={handleSubmit}
      >
        {/* LOGO */}
        <section className='flex text-[26px]'>
          <h2 className='text-primary font-bold text-inherit'>MCP</h2>
          <span className='text-white-p'>PLATFORM</span>
        </section>

        {/* Email input */}
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

        <button
          onClick={() => navigate('/forgot-password')}
          type='button'
          className='self-end flex items-center gap-1 text-primary font-semibold translate-y-2'
        >
          Olvide mi contraseña <MdArrowForwardIos />
        </button>

        {/* Password Input */}
        <InputPassword
          value={formData.password}
          handleChange={handleChange}
          label='Contraseña'
          name='password'
          required={true}
          error={
            emptyPassword ||
            (formData.password.length > 0 && formData.password.length < 8)
          }
        />

        {/* Iniciar sesión */}
        <Button
          isLoading={loadingButton}
          type='submit'
          color='primary'
          className='w-full max-w-[200px] disabled:bg-neutral'
          disabled={isHandleSubmitEnable()}
        >
          Iniciar sesión
        </Button>

        {/* ó */}
        <div className='flex w-full gap-2 items-center'>
          <span className='flex-1 h-[1px] bg-white-p'></span> <span>ó</span>{' '}
          <span className='flex-1 h-[1px] bg-white-p'></span>
        </div>

        {/* Crear cuenta */}
        <Link
          className='font-semibold flex items-center gap-1 text-primary'
          to='/register'
        >
          Crear cuenta <IoChevronForwardOutline className='w-[18px] h-[18px]' />
        </Link>
      </form>
    </main>
  );
};

export default Login;
