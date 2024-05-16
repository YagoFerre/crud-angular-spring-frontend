import { Lesson } from './lesson';

export interface Course {
  id: number;
  name: string;
  category: string;
  lessons?: Lesson[];
}
