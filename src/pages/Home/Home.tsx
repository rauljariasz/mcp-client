import CourseCard from '@/components/common/CourseCard';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@hooks/useAuth';
import { Image } from '@nextui-org/react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { courses } = useCourses();

  return (
    <main className='flex-1 py-10'>
      {/* FALTA SALUDO AL USUARIO LOGUEADO */}
      {/* Propuesta de valor */}
      {isAuthenticated ? null : (
        <section className='int-container flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-10 mb-10'>
          <Image
            alt='Imagen que ilustra un astronauta'
            src={`${import.meta.env.VITE_API_IMGS_URL}prueba.jpg`}
            isBlurred
            className='w-full max-w-[300px]'
          />
          <div>
            <h1 className='text-[24px] font-semibold mb-4 sm:text-center'>
              Lorem ipsum dolor sit{' '}
              <span className='text-primary'>amet consectetur</span>
            </h1>
            <p className='sm:text-center sm:max-w-[430px] mx-auto'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum iste, aspernatur dicta aperiam magni error consectetur
              natus tempora cupiditate optio dolorem minima, excepturi quisquam
              blanditiis labore possimus at ratione vero.
            </p>
          </div>
        </section>
      )}

      {/* Lista de cursos */}
      <section className='int-container '>
        <h2 className='text-[24px] sm:text-[32px] font-semibold uppercase text-primary mb-4'>
          {isAuthenticated ? 'Cursos disponibles' : 'Nuestros cursos'}
        </h2>
        <div className='grid-320 gap-6 justify-center md:justify-evenly'>
          {courses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
