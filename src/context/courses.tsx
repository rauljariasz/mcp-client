import { CourseInterface } from '@/types';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

interface CoursesContextType {
  courses: CourseInterface[];
  setCourses: Dispatch<SetStateAction<CourseInterface[]>>;
}

interface CoursesProviderProps {
  children: ReactNode;
}

export const CoursesContext = createContext<CoursesContextType | undefined>(
  undefined
);

export function CoursesProvider({ children }: CoursesProviderProps) {
  const [courses, setCourses] = useState<CourseInterface[]>([]);

  return (
    <CoursesContext.Provider
      value={{
        courses,
        setCourses,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}
