export enum LEVELS {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface CourseInterface {
  id: number;
  title: string;
  description: string;
  level: LEVELS;
  nameUrl: string;
  imageUrl: string | null;
}
