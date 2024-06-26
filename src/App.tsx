import { HashRouter } from 'react-router-dom';
import AppRoutes from '@pages/AppRoutes';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@context/auth';
import 'react-toastify/dist/ReactToastify.css';
import { CoursesProvider } from './context/courses';
import { InitialLoadProvider } from './context/initialLoad';

function App() {
  return (
    <NextUIProvider>
      <AuthProvider>
        <CoursesProvider>
          <InitialLoadProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
          </InitialLoadProvider>
        </CoursesProvider>
      </AuthProvider>
    </NextUIProvider>
  );
}

export default App;
