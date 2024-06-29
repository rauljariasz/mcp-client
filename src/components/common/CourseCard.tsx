import { FC } from 'react';
import { CourseInterface } from '@/types';
import { Card, CardBody, Image } from '@nextui-org/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SiGitbook } from 'react-icons/si';

interface CourseCardInterface {
  course: CourseInterface;
}

const CourseCard: FC<CourseCardInterface> = ({ course }) => {
  // Hooks
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePress = (course: CourseInterface) => {
    if (isAuthenticated) {
      navigate(`/course/${course.nameUrl}`);
    } else {
      navigate('/register');
    }
  };

  return (
    <Card
      className='bg-primary/20 text-white-p'
      key={course.id}
      isPressable
      onPress={() => handlePress(course)}
    >
      <CardBody className='flex flex-row h-[90px] gap-3'>
        {/* Imagen */}
        {course.imageUrl ? (
          <figure>
            <Image
              isBlurred
              alt='Imagen que ilustra un astronauta'
              className='w-full max-w-[65px]'
              src={`${import.meta.env.VITE_API_IMGS_URL}${course.imageUrl}.jpg`}
            />
          </figure>
        ) : (
          <SiGitbook className='w-[65px] h-[55px] self-center text-primary' />
        )}

        {/* Titulo */}
        <section className='flex-1 self-center'>
          <p className='line-clamp-2 font-semibold'>{course.title}</p>
        </section>

        {/* Flecha */}
        <section className='flex-center'>
          <MdKeyboardArrowRight className='w-[25px] h-[25px]' />
        </section>
      </CardBody>
    </Card>
  );
};

export default CourseCard;
