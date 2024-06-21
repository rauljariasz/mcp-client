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

  return (
    <Navbar
      className='bg-[#0a0c0d77]'
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
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
            to='/contact'
            className='text-primary font-semibold hover:text-quaternary transition-all'
          >
            Contacto
          </RouterLink>
        </NavbarItem>

        <NavbarItem>
          <RouterLink
            to='/pricing'
            className='text-primary font-semibold hover:text-quaternary transition-all'
          >
            Precios
          </RouterLink>
        </NavbarItem>
      </NavbarContent>

      {/* Botón "inicia sesión" */}
      <NavbarContent justify='end'>
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
      </NavbarContent>

      {/* Navegación Mobile */}
      <NavbarMenu className='bg-secondary'>
        <NavbarMenuItem>
          <RouterLink
            onClick={() => setIsMenuOpen(false)}
            to='/contact'
            className='text-primary font-semibold hover:text-secondary transition-all'
          >
            Contacto
          </RouterLink>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <RouterLink
            onClick={() => setIsMenuOpen(false)}
            to='/pricing'
            className='text-primary font-semibold hover:text-quaternary transition-all'
          >
            Precios
          </RouterLink>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
