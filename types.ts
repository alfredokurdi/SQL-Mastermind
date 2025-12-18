
export interface Lesson {
  id: string;
  title: string;
  description: string;
  task: string;
  expectedQuery: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  schema: string;
  initialData: any[];
}

export interface QueryResult {
  columns: string[];
  rows: any[];
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserProgress {
  completedLessons: string[];
  currentLessonId: string;
}
