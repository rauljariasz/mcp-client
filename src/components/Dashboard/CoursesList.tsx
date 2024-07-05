import { useCourses } from '@/hooks/useCourses';
import CreateCourseModal from './CreateCourseModal';
import CourseCardAdmin from '../common/CourseCardAdmin';

const CoursesList = () => {
  // Hooks
  const { courses } = useCourses();

  return (
    <section className='mt-10 pb-10'>
      {/* Titulo y boton "+" */}
      <div className='flex justify-between items-center'>
        <h2 className='text-[24px] sm:text-[32px] font-semibold uppercase text-primary'>
          Cursos
        </h2>

        {/* Modal crear curso */}
        <CreateCourseModal />
      </div>

      {/* Lista de cursos */}
      <div className='grid-320 gap-6 justify-center md:justify-evenly mt-8'>
        {courses.map((course) => (
          <CourseCardAdmin course={course} key={course.id} />
        ))}
      </div>
    </section>
  );
};

export default CoursesList;
