import { HashRouter } from 'react-router-dom';
import AppRoutes from '@pages/AppRoutes';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@context/auth';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <NextUIProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </NextUIProvider>
  );
}

export default App;
