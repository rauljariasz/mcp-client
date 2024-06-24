import { Outlet } from 'react-router-dom';
import Header from './Navbar/Header';

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
