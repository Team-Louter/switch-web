import { QnaItem } from "./QnaItem";
import type { Comment } from "./types/Qna.type";

interface Props {
  comments: Comment[];
}

export default function QnaList({ comments }: Props) {
  if (!comments.length) return null;

  const question = comments[0];

  return (
    <>
      <QnaItem comment={question} />

      {question.replies.map((reply) => (
        <QnaItem key={reply.id} comment={reply} isReply />
      ))}
    </>
  );
}
