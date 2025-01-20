export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    tags: string[];
    dueDate: string;
    createdAt: string;
    updatedAt: string;
  }