export interface Comment {
  id: number;
  userName: string;
  content: string;
  time: string;
  profileUrl: string;
  replies: Comment[];
}