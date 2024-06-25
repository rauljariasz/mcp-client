import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Input from '@/components/common/Input';
import { MdOutlineEmail } from 'react-icons/md';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import { onlyLettersAndNumbers, validateEmail } from '@/constants/regex';
import { Button } from '@nextui-org/react';
import InputPassword from '@/components/common/InputPassword';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '@/hooks/useNotify';
import { ToastContainer } from 'react-toastify';

interface FormData {
  email: string;
  password: string;
  username: string;
  name: string;
  last_name: string;
}

const Register: React.FC = () => {
  // States
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: '',
    name: '',
    last_name: '',
  });

  // Hooks
  const emptyName = useEmptyInput(formData.name);
  const emptyEmail = useEmptyInput(formData.email);
  const emptyLastName = useEmptyInput(formData.last_name);
  const emptyUsername = useEmptyInput(formData.username);
  const emptyPassword = useEmptyInput(formData.password);
  const navigate = useNavigate();
  const { notifyError } = useNotify();

  // Función para controlar los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // *--------------* //
    // Prevalidaciones //
    // *------------* //

    // Nombre & Apellido
    if (name === 'name' || name === 'last_name') {
      if (value.length > 30) {
        return;
      }
    }

    // Correo
    if (name === 'email') {
      if (value.length > 250) {
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

  // Función de enviar
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      await axios
        .post(`${import.meta.env.VITE_API_URL}auth/register`, formData)
        .then(() => {
          sessionStorage.setItem('verify', formData.email);
          navigate('/verify');
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          notifyError(error.response?.data?.message);
          return;
        } else {
          notifyError('Ha ocurrido un error, por favor intenta mas tarde.');
          return;
        }
      }
      notifyError('Ha ocurrido un error, por favor intenta mas tarde.');
    } finally {
      setLoadingButton(false);
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
      validateEmail(formData.email) &&
      formData.name.length > 2 &&
      formData.last_name.length > 2 &&
      formData.username.length > 3
    );
  };

  return (
    <main className='main-container flex-center py-6'>
      <ToastContainer theme='colored' draggable className='md:w-[600px]' />

      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center w-full max-w-[380px] gap-4 px-6 py-8 rounded-2xl bg-secondary transition-all'
      >
        {/* LOGO */}
        <section className='flex text-[26px]'>
          <h2 className='text-primary font-bold text-inherit'>MCP</h2>
          <span className='text-white-p'>PLATFORM</span>
        </section>

        <h1 className='text-[26px] font-semibold text-white-p'>
          Crea tu cuenta
        </h1>

        {/* Nombre  */}
        <Input
          name='name'
          type='text'
          value={formData.name}
          label='Nombre'
          handleChange={handleChange}
          error={
            emptyName || (formData.name.length > 0 && formData.name.length < 2)
          }
        />

        {/* Apellido */}
        <Input
          name='last_name'
          type='text'
          value={formData.last_name}
          label='Apellido'
          handleChange={handleChange}
          error={
            emptyLastName ||
            (formData.last_name.length > 0 && formData.last_name.length < 2)
          }
        />

        {/* Nombre de usuario */}
        <Input
          name='username'
          type='text'
          value={formData.username}
          label='Nombre de usuario'
          handleChange={handleChange}
          error={
            emptyUsername ||
            (formData.username.length > 0 && formData.username.length < 3)
          }
        />

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

        {/* Password Input */}
        <InputPassword
          value={formData.password}
          handleChange={handleChange}
          label='Contraseña'
          name='password'
          required={true}
          requeriments={true}
          firstInput={
            (!emptyPassword && formData.password.length > 0) || emptyPassword
          }
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
          Registrar
        </Button>
      </form>
    </main>
  );
};

export default Register;
