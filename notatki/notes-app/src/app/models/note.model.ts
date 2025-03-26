export interface Note {
  id?: number;
  title: string;
  content: string;
  imagePath?: string;
  createdAt?: Date;
  order?: number;
}