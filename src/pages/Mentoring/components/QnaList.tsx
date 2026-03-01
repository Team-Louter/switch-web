import { QnaItem } from "./QnaItem";
import type { Comment } from "./types/Qna.types";

interface Props {
  comments: Comment[];
}

export default function QnaList({ comments }: Props) {
  if (!comments.length) return null;

  const question = comments[0];

  return (
    <>
      {/* 최초 질문 */}
      <QnaItem comment={question} />

      {/* 답변들 - 전부 같은 레벨 */}
      {question.replies.map((reply) => (
        <QnaItem key={reply.id} comment={reply} isReply />
      ))}
    </>
  );
}
