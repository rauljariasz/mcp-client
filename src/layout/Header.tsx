import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav>
      <Link to='/'>Home</Link>
      <Link to='/otra'>Otra</Link>
    </nav>
  );
};

export default Header;
