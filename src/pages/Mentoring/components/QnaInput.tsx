import { useRef, useState } from "react";
import * as S from "./styles/QnaInput.styled";
import imageIcon from '../../../assets/mentoringImg/img.png';
import codeIcon from '../../../assets/mentoringImg/code.png';
import sendIcon from '../../../assets/mentoringImg/send.png';

const MAX_LENGTH = 700;

export default function QnaInput() {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      console.log("전송:", value);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      return;
    }
  
    if (e.key === "Enter" && (e.metaKey || e.shiftKey)) {
    }
  };

  const handleImageInsert = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const snippet = `![${file.name}](이미지URL)`;
      const newValue = value.slice(0, start) + snippet + value.slice(start);
      setValue(newValue);
    };
    input.click();
  };

  const handleCodeInsert = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    const snippet = `\`\`\`\n${selected}\n\`\`\``;
    const newValue = value.slice(0, start) + snippet + value.slice(end);

    setValue(newValue);

    setTimeout(() => {
      const cursor = start + 4;
      textarea.setSelectionRange(cursor, cursor + selected.length);
      textarea.focus();
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_LENGTH) return;
    setValue(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <S.Wrapper>
      <S.TextareaWrapper>
        <S.Input
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="답변을 남겨보세요."
        rows={1}
        />
      </S.TextareaWrapper>

      <S.Toolbar>
        <S.ToolLeft>
          <S.IconButton type="button" onClick={handleImageInsert}>
          <img src={imageIcon} alt="이미지" width={18} height={18} />
          </S.IconButton>
          <S.IconButton type="button" onClick={handleCodeInsert}>
            <img src={codeIcon} alt="코드" width={18} height={18} />
          </S.IconButton>
        </S.ToolLeft>

        <S.ToolRight>
          <S.CharCount isOver={value.length > MAX_LENGTH}>
            {value.length}/{MAX_LENGTH}
          </S.CharCount>
          <S.IconButton type="button">
            <img src={sendIcon} alt="전송" width={18} height={18} />
          </S.IconButton>
        </S.ToolRight>
      </S.Toolbar>
    </S.Wrapper>
  );
}