import { useCourses } from '@/hooks/useCourses';
import { useData } from '@/hooks/useData';
import { CourseInterface } from '@/types';
import { ClassesInterface } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateClassModal from '@/components/DashboardCourse/CreateClassModal';
import { ToastContainer } from 'react-toastify';
import ClassCardAdmin from '@/components/common/ClassCardAdmin';

const DashboardCourse = () => {
  // States
  const [course, setCourse] = useState<CourseInterface>();
  const [classes, setClasses] = useState<ClassesInterface[]>([]);

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

  if (!course?.id) {
    return;
  }

  return (
    <main className='main-container'>
      <ToastContainer
        containerId='dashboardCourseToast'
        theme='colored'
        draggable
        className='md:w-[600px]'
      />

      <div className='flex justify-between md:justify-start gap-5'>
        <h1 className='text-[24px] md:text-[28px] text-primary font-semibold uppercase'>
          {course?.title}
        </h1>

        {/* Modal Crear Clase */}
        <CreateClassModal setClasses={setClasses} courseId={course?.id} />
      </div>
      <div className='flex flex-col w-full items-start py-4 md:py-10'>
        {/* lista de clases */}
        <section className='flex-1 py-6 md:py-0 grid-320 justify-around gap-6 w-full'>
          {classes?.map((item) => (
            <ClassCardAdmin
              key={item.id}
              classe={item}
              setClasses={setClasses}
            />
          ))}
        </section>
      </div>
    </main>
  );
};

export default DashboardCourse;
