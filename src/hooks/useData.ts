import { CoursesContext } from '@/context/courses';
import { useContext } from 'react';
import axios from 'axios';

export const useData = () => {
  const coursesContext = useContext(CoursesContext);
  if (!coursesContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const getCourses = async () => {
    try {
      await axios
        .get(`${import.meta.env.VITE_API_URL}data/getCourses`)
        .then((res) => {
          coursesContext.setCourses(res.data.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getCourses,
  };
};
