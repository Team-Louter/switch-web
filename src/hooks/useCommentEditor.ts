import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createComment, editComment } from '@/api/comment';
import { toast } from '@/store/toastStore';

interface UseCommentEditorParams {
  comment?: { commentId: number; content: string; isAnonymous: boolean };
  isEditing: boolean;
  content: string;
  isAnonymous: boolean;
  parentId: number | null;
  onSuccess?: () => void;
  onClose?: () => void;
  setContent: (content: string) => void;
}

export const useCommentEditor = ({
  comment,
  isEditing,
  content,
  isAnonymous,
  parentId,
  onSuccess,
  onClose,
  setContent,
}: UseCommentEditorParams) => {
  const { postId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isEditing && comment?.commentId) {
        await editComment(Number(postId), comment?.commentId, content);
        toast.success('댓글 수정 성공');
      } else {
        await createComment(Number(postId), {
          content,
          isAnonymous,
          parentId,
        });
        setContent('');
        toast.success('댓글 게시 성공');
      }
      onSuccess?.();
      onClose?.();
    } catch {
      toast.error(isEditing ? '댓글 수정 실패' : '댓글 게시 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
