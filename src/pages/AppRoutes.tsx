import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Otra from './Register/Register';
import Layout from '../layout/Layout';

const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/otra' element={<Otra />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
