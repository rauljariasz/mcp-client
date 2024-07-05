import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from '@nextui-org/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RxExit } from 'react-icons/rx';
import { useInitialLoad } from '@/hooks/useInitialLoad';
import './Header.css';
import { ROLES } from '@/types';

// *---------------------------------------------------------* //
// Tener en cuenta a que debido que se esta usando hashRouter //
// No se puede usar el componente Link de nextui-org. Cuando //
// se use BrowserRouter, se debe cambiar el de react router //
// por el componente de nextui.                            //
// https://nextui.org/docs/components/navbar              //
// *---------------------------------------------------* //
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Hooks
  const navigate = useNavigate();
  const { isAuthenticated, logout, userInfo } = useAuth();
  const { initialLoad } = useInitialLoad();

  return (
    <Navbar
      className='bg-[#0a0c0d77]'
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        menu: 'bg-blue-200',
      }}
    >
      {/* Menu hamburguesa */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className='sm:hidden text-white-p'
        />
        {/* Este texto puede ser reemplazable por un logo */}
        <NavbarBrand>
          <RouterLink to='/'>
            <span className='text-primary font-bold text-inherit'>MCP</span>
            <span className='text-white-p'>PLATFORM</span>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Navegación Desktop */}
      <NavbarContent className='hidden sm:flex gap-8' justify='center'>
        <NavbarItem>
          <RouterLink
            to='/'
            className='text-primary font-semibold hover:text-quaternary transition-all'
          >
            Inicio
          </RouterLink>
        </NavbarItem>

        <NavbarItem>
          <span className='text-primary font-semibold hover:text-quaternary transition-all'>
            Contacto
          </span>
        </NavbarItem>

        <NavbarItem>
          <span className='text-primary font-semibold hover:text-quaternary transition-all'>
            Precios
          </span>
        </NavbarItem>

        {/* Mi perfil */}
        {isAuthenticated && userInfo.role !== ROLES.ADMIN && (
          <NavbarItem>
            <RouterLink
              to='/profile'
              className='text-warm font-semibold hover:text-quaternary flex w-full'
            >
              Mi perfil
            </RouterLink>
          </NavbarItem>
        )}

        {/* Dashboard */}
        {userInfo.role === ROLES.ADMIN ? (
          <NavbarItem>
            <RouterLink
              to='/dashboard'
              className='text-warm font-semibold hover:text-quaternary flex w-full'
            >
              Dashboard
            </RouterLink>
          </NavbarItem>
        ) : null}
      </NavbarContent>

      {/* Botón "inicia sesión" */}
      {isAuthenticated ? (
        <NavbarContent justify='end' className='sm:flex hidden'>
          <button
            className='flex items-center gap-2 text-error font-semibold'
            type='button'
            onClick={() => {
              setIsMenuOpen(false);
              logout();
              navigate('/', { replace: true });
            }}
          >
            Salir
            <RxExit className='w-5 h-5' />
          </button>
        </NavbarContent>
      ) : (
        <NavbarContent justify='end'>
          {!initialLoad && (
            <Button
              as={Link}
              color='primary'
              onPress={() => {
                setIsMenuOpen(false);
                navigate('/login');
              }}
              variant='flat'
            >
              Inicia sesión
            </Button>
          )}
        </NavbarContent>
      )}

      {/* Navegación Mobile */}
      <NavbarMenu className='bg-secondary'>
        <NavbarMenuItem>
          <RouterLink
            onClick={() => setIsMenuOpen(false)}
            to='/'
            className='text-white-p font-semibold hover:text-secondary flex w-full'
          >
            Inicio
          </RouterLink>
        </NavbarMenuItem>

        <span className='w-full h-[1px] bg-white-p my-2'></span>

        <NavbarMenuItem>
          <span className='text-white-p font-semibold flex w-full'>
            Contacto
          </span>
        </NavbarMenuItem>

        <span className='w-full h-[1px] bg-white-p my-2'></span>

        <NavbarMenuItem>
          <span className='text-white-p font-semibold flex w-full'>
            Precios
          </span>
        </NavbarMenuItem>

        {/* Mi perfil */}
        {isAuthenticated && userInfo.role !== ROLES.ADMIN ? (
          <>
            <span className='w-full h-[1px] bg-white-p my-2'></span>
            <NavbarMenuItem>
              <RouterLink
                onClick={() => setIsMenuOpen(false)}
                to='/profile'
                className='text-primary font-semibold hover:text-quaternary flex w-full'
              >
                Mi perfil
              </RouterLink>
            </NavbarMenuItem>
          </>
        ) : null}

        {/* Dashboard */}
        {userInfo.role === ROLES.ADMIN ? (
          <>
            <span className='w-full h-[1px] bg-white-p my-2'></span>
            <NavbarMenuItem>
              <RouterLink
                onClick={() => setIsMenuOpen(false)}
                to='/dashboard'
                className='text-warm font-semibold hover:text-quaternary flex w-full'
              >
                Dashboard
              </RouterLink>
            </NavbarMenuItem>
          </>
        ) : null}

        <span className='w-full h-[1px] bg-white-p my-2'></span>

        {/* Salir */}
        {isAuthenticated ? (
          <NavbarMenuItem>
            <button
              className='flex items-center gap-2 text-error font-semibold'
              type='button'
              onClick={() => {
                setIsMenuOpen(false);
                logout();
                navigate('/', { replace: true });
              }}
            >
              Salir <RxExit className='w-5 h-5' />
            </button>
          </NavbarMenuItem>
        ) : null}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
