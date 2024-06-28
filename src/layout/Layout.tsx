import { Outlet } from 'react-router-dom';
import Header from './Navbar/Header';
import Footer from './Footer/Footer';

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
