import { useState } from 'react';
import * as S from './QnaItem.style.ts';
import type { Comment } from '@/types/mentoring';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('sql', sql);

interface QnaItemProps {
  comment: Comment;
  isFirst?: boolean;
}

export default function QnaItem({ comment, isFirst = false }: QnaItemProps) {
  const isRoot = isFirst;
  const hasImages = Boolean(comment.images && comment.images.length > 0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <S.CommentRow $isReply={false}>
        <S.ProfileGroup>
          <S.Avatar src={comment.profileUrl} $isReply={false} />
        </S.ProfileGroup>

        <S.ContentGroup>
          <S.UserName>{comment.userName}</S.UserName>

          <S.CommentMetaRow>
            <S.CommentText $isRoot={isRoot}>
              {comment.images && comment.images.length > 0 && (
                <S.AttachedImageList>
                  {comment.images.map((url, i) => (
                    <S.AttachedImage
                      key={i}
                      src={url}
                      alt={`첨부 이미지 ${i + 1}`}
                      onClick={() => handleImageClick(url)}
                    />
                  ))}
                </S.AttachedImageList>
              )}

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p({ children }) {
                    return (
                      <S.CommentTextInner $hasImages={hasImages}>
                        {children}
                      </S.CommentTextInner>
                    );
                  },
                  code({ children, className, node }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    const isBlock =
                      !!match ||
                      (node?.position?.start.line ?? 0) !==
                        (node?.position?.end.line ?? 0);

                    if (!isBlock) {
                      // 인라인 코드: hljs 제거, 그냥 텍스트로 렌더링
                      return <S.InlineCode>{codeString}</S.InlineCode>;
                    }

                    const detectedLanguage = match?.[1] || 'plaintext';

                    return (
                      <S.BlockCodeWrapper>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={detectedLanguage}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            padding: '14px 20px',
                            fontSize: '0.875rem',
                          }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </S.BlockCodeWrapper>
                    );
                  },
                }}
              >
                {comment.content}
              </ReactMarkdown>
            </S.CommentText>

            <S.Time>{comment.time}</S.Time>
          </S.CommentMetaRow>
        </S.ContentGroup>
      </S.CommentRow>

      {selectedImage && (
        <S.ImageModalOverlay onClick={closeModal}>
          <S.ImageModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalImage src={selectedImage} />
          </S.ImageModalContent>
        </S.ImageModalOverlay>
      )}
    </>
  );
}