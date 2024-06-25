import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/types';
import { Chip } from '@nextui-org/react';
import EditUserData from '@/components/Profile/EditUserData';
import { ToastContainer } from 'react-toastify';
import EditEmail from '@/components/Profile/EditEmail';
import EditPassword from '@/components/Profile/EditPassword';

const Profile = () => {
  const { userInfo } = useAuth();
  return (
    <main className='main-container flex flex-col'>
      <ToastContainer
        containerId='profileToast'
        theme='colored'
        draggable
        className='md:w-[600px]'
      />
      <h1 className='self-center text-[27px] font-bold uppercase mb-4'>
        Tu perfil
      </h1>
      {/* Plan */}
      <section className='self-center mb-4'>
        {userInfo?.role === ROLES.FREE && (
          <Chip variant='faded' color='primary'>
            Gratis
          </Chip>
        )}
        {userInfo?.role === ROLES.PREMIUM && (
          <Chip variant='shadow' color='primary'>
            Premium
          </Chip>
        )}
      </section>

      {/* Nombre, apellido, nombre de usuario */}
      <section className='w-full max-w-[420px] mx-auto flex flex-col gap-2'>
        {/* Nombre */}
        <div>
          <span className='font-semibold text-primary'>Nombre:</span>{' '}
          {userInfo.name}
        </div>

        {/* Apellido */}
        <div>
          <span className='font-semibold text-primary'>Apellido:</span>{' '}
          {userInfo.lastName}
        </div>

        {/* Nombre de usuario */}
        <div>
          <span className='font-semibold text-primary'>Usuario:</span>{' '}
          {userInfo.username}
        </div>

        <EditUserData />
      </section>

      <span className='w-full h-[1px] bg-white-p max-w-[420px] mx-auto my-5'></span>

      {/* Correo electronico */}
      <section className='w-full max-w-[420px] mx-auto flex flex-col gap-2'>
        {/* Correo */}
        <div>
          <span className='font-semibold text-primary'>Correo:</span>{' '}
          {userInfo.email}
        </div>

        <EditEmail />
      </section>

      <span className='w-full h-[1px] bg-white-p max-w-[420px] mx-auto my-5'></span>

      {/* Correo electronico */}
      <section className='w-full max-w-[420px] mx-auto flex flex-col gap-2'>
        {/* Correo */}
        <div>
          <span className='font-semibold text-primary'>Contraseña:</span>{' '}
          ************
        </div>

        <EditPassword />
      </section>
    </main>
  );
};

export default Profile;
