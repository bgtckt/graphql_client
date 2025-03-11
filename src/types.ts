export type Post = {
  id: number;
  userId: number;
  text: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  posts?: Post[];
}