import { useAuth } from '@hooks/useAuth';

const Home = () => {
  const { isAuthenticated, userInfo } = useAuth();
  return (
    <main className='main-container h-[2000px]'>
      {isAuthenticated ? <p>Hola {userInfo.name}</p> : 'No logueado'}
    </main>
  );
};

export default Home;
