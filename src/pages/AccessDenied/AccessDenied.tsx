import { TbLockAccess } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <main className='main-container flex-center'>
      <section className='flex flex-col items-center gap-2'>
        <TbLockAccess className='w-[100px] h-[100px] text-error' />
        <p className='text-[21px] text-center font-semibold'>
          Para tener acceso a esta pagina debes{' '}
          <Link to='/login' replace className='text-primary relative'>
            iniciar sesión.
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AccessDenied;
