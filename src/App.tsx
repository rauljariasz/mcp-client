import { HashRouter } from 'react-router-dom';
import AppRoutes from './pages/AppRoutes';
import { NextUIProvider } from '@nextui-org/react';

function App() {
  return (
    <NextUIProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </NextUIProvider>
  );
}

export default App;
