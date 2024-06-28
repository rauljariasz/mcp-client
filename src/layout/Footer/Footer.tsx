import { Button } from '@/components/common/movingBorder';
import { BiLogoLinkedin, BiLogoInstagramAlt } from 'react-icons/bi';

const Footer = () => {
  const linkedin = 'https://www.linkedin.com/in/rauljariasz/';
  const instagram = 'https://www.instagram.com/rauljariasz/';

  const handleClickOpenLink = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <footer className='py-10 bg-secondary'>
      <section className='flex-center flex-col'>
        <p>Pagina elaborada por Raul Arias ©</p>
        <div className='mt-4 flex gap-4'>
          {/* Linkedin */}
          <Button
            borderRadius='1rem'
            className='bg-black-p'
            containerClassName='w-[50px] h-[50px]'
            onClick={() => handleClickOpenLink(linkedin)}
          >
            <BiLogoLinkedin className='w-6 h-6' />
          </Button>

          {/* Instagram */}
          <Button
            borderRadius='1rem'
            className='bg-black-p'
            containerClassName='w-[50px] h-[50px]'
            onClick={() => handleClickOpenLink(instagram)}
          >
            <BiLogoInstagramAlt className='w-6 h-6' />
          </Button>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
