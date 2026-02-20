export interface Todo {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}
