import { ROLES } from './user';

export interface ClassesInterface {
  id: number;
  title: string;
  description: string;
  role: ROLES;
  classNumber: number;
  imageUrl: string | null;
  routeId: number;
  videoUrl: string;
}
