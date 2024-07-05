import { HashRouter } from 'react-router-dom';
import AppRoutes from '@pages/AppRoutes';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@context/auth';
import 'react-toastify/dist/ReactToastify.css';
import { CoursesProvider } from './context/courses';
import { InitialLoadProvider } from './context/initialLoad';
import { ThemeProvider } from '@material-tailwind/react';

function App() {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <AuthProvider>
          <CoursesProvider>
            <InitialLoadProvider>
              <HashRouter>
                <AppRoutes />
              </HashRouter>
            </InitialLoadProvider>
          </CoursesProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}

export default App;
