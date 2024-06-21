import { Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Register from './Register/Register';
import Layout from '../layout/Layout';
import Pricing from './Pricing/Pricing';
import Contact from './Contact/Contact';
import Login from './Login/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/contact' element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
