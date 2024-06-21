import { Outlet } from 'react-router-dom';
import Header from './Navbar/Header';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
