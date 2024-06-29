import { useCourses } from '@/hooks/useCourses';
import { useData } from '@/hooks/useData';
import { CourseInterface } from '@/types';
import { ClassesInterface } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextGenerateEffect } from '@components/common/TextGenerateEffect';
import ClasseCard from '@/components/common/ClasseCard';

const Course = () => {
  // States
  const [course, setCourse] = useState<CourseInterface>();
  const [classes, setClasses] = useState<ClassesInterface[]>();

  // Hooks
  const { courses } = useCourses();
  const { courseUrl } = useParams();
  const { getClasses } = useData();
  const navigate = useNavigate();

  //   Efecto para encontrar el curso seleccionado
  useEffect(() => {
    if (courses.length < 1) {
      return;
    }

    const courseSlcted = courses.find((course) => course.nameUrl === courseUrl);

    if (!courseSlcted) {
      navigate('/');
    }

    getClasses(String(courseSlcted?.id)).then((res) => setClasses(res));

    setCourse(courseSlcted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);

  return (
    <main className='main-container'>
      <h1 className='text-[24px] md:text-[28px] text-primary font-semibold uppercase'>
        {course?.title}
      </h1>
      <div className='flex flex-col md:flex-row-reverse w-full gap-4 md:gap-8 items-start py-4 md:py-10'>
        {/* Descripción */}
        <section className='md:flex-1'>
          <div className=''>
            <TextGenerateEffect
              words={course?.description || ''}
              className=''
            />
          </div>
        </section>

        {/* lista de clases */}
        <section className='flex-1 py-6 md:py-0 flex flex-col gap-6 w-full'>
          {classes?.map((item) => (
            <ClasseCard key={item.id} classe={item} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Course;
