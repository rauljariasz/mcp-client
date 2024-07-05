import { CoursesContext } from '@/context/courses';
import { useContext } from 'react';

export const useCourses = () => {
  const coursesContext = useContext(CoursesContext);
  if (!coursesContext) {
    throw new Error('useCourses must be used within an CoursesContext');
  }

  const { courses, setCourses } = coursesContext;

  return { courses, setCourses };
};
