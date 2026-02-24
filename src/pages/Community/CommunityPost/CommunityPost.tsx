import { colors } from "@/styles/values/_foundation";
import * as S from "./CommunityPost.styled";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { CATEGORIES, CATEGORY_TAGS } from "@/constants/Community";
import CategoryDropdown from "../components/CategoryDropdown/CategoryDropdown";
import Markdown from "../components/Markdown/Markdown";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";

const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    html: false,
});

const MAX_LENGTH = 2000;

export default function CommunityPost() {
    const navigate = useNavigate();
    const location = useLocation();
    const editPost = location.state?.post;

    const [selectedCategory, setSelectedCategory] = useState(editPost?.category ?? "");
    const [selectedTag, setSelectedTag] = useState(editPost?.tag ?? "");
    const [content, setContent] = useState(editPost?.content ?? "");
    const [title, setTitle] = useState(editPost?.title ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isComposingRef = useRef(false);

    const tags = CATEGORY_TAGS[selectedCategory] ?? [];
    const rendered = DOMPurify.sanitize(md.render(content));
    const isOverLimit = content.length >= MAX_LENGTH;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_LENGTH) {
            setContent(e.target.value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Enter") return;

        const el = textareaRef.current;
        if (!el) return;

        if (isComposingRef.current) {
            const pos = el.selectionStart;
            const lineStart = content.lastIndexOf("\n", pos - 1) + 1;
            const currentLine = content.substring(lineStart, pos);
            const ulMatch = currentLine.match(/^(\s*[-*]\s)/);
            const olMatch = currentLine.match(/^(\s*)(\d+)\.\s?/);
            if (!ulMatch && !olMatch) return;

            e.preventDefault();
            const savedPos = pos;
            setTimeout(() => {
                const domValue = el.value;
                const lineStartAfter = domValue.lastIndexOf("\n", savedPos - 1) + 1;
                const lineAfterIME = domValue.substring(lineStartAfter, domValue.indexOf("\n", lineStartAfter) === -1 ? domValue.length : domValue.indexOf("\n", lineStartAfter));
                processListEnter(domValue, lineStartAfter, lineAfterIME, el, ulMatch, olMatch);
            }, 0);
            return;
        }

        const pos = el.selectionStart;
        const lineStart = content.lastIndexOf("\n", pos - 1) + 1;
        const currentLine = content.substring(lineStart, pos);

        const ulMatch = currentLine.match(/^(\s*[-*]\s)/);
        const olMatch = currentLine.match(/^(\s*)(\d+)\.\s?/);

        if (!ulMatch && !olMatch) return;

        e.preventDefault();
        processListEnter(content, lineStart, currentLine, el, ulMatch, olMatch);
    };

    const processListEnter = (
        value: string,
        lineStart: number,
        currentLine: string,
        el: HTMLTextAreaElement,
        ulMatch: RegExpMatchArray | null,
        olMatch: RegExpMatchArray | null
    ) => {
        const pos = el.selectionStart;

        if (ulMatch) {
            const prefix = ulMatch[1];
            if (currentLine === prefix) {
                const newValue = value.substring(0, lineStart) + value.substring(pos);
                setContent(newValue);
                requestAnimationFrame(() => el.setSelectionRange(lineStart, lineStart));
                return;
            }
            const insertText = "\n" + prefix;
            const newValue = value.substring(0, pos) + insertText + value.substring(pos);
            if (newValue.length > MAX_LENGTH) return;
            setContent(newValue);
            requestAnimationFrame(() => el.setSelectionRange(pos + insertText.length, pos + insertText.length));

        } else if (olMatch) {
            const indent = olMatch[1];
            const num = parseInt(olMatch[2], 10);
            const olPrefix = indent + num + ". ";
            if (currentLine === olPrefix || currentLine === indent + num + ".") {
                const newValue = value.substring(0, lineStart) + value.substring(pos);
                setContent(newValue);
                requestAnimationFrame(() => el.setSelectionRange(lineStart, lineStart));
                return;
            }
            const insertText = "\n" + indent + (num + 1) + ". ";
            const newValue = value.substring(0, pos) + insertText + value.substring(pos);
            if (newValue.length > MAX_LENGTH) return;
            setContent(newValue);
            requestAnimationFrame(() => el.setSelectionRange(pos + insertText.length, pos + insertText.length));
        }
    };

    const isPostValid = !!title.trim() && !!selectedCategory && !!content.trim();
    const hasContent = !!content.trim();

    const handleConfirmPost = () => {
        if (!isPostValid) return;
        setIsModalOpen(false);
        // TODO: 게시 API 호출
    };

    return (
        <S.Container>
            <S.Top>
                <S.ForRow style={{ justifyContent: "space-between" }}>
                    <S.Div style={{ cursor: "pointer" }} onClick={() => hasContent ? setIsCancelModalOpen(true) : navigate(-1)}>
                        <IoIosArrowBack size={30} color={colors.fill.yellow} />
                        <S.TitleLabel>{editPost ? "게시글 수정" : "게시글 작성"}</S.TitleLabel>
                    </S.Div>
                    <S.Confirm onClick={() => setIsModalOpen(true)}>게시</S.Confirm>
                </S.ForRow>

                <S.ForRow style={{ gap: 50 }}>
                    <CategoryDropdown
                        options={CATEGORIES.filter((c) => c !== "전체")}
                        selected={selectedCategory}
                        onChange={(category: string) => {
                            setSelectedCategory(category);
                            setSelectedTag("");
                        }}
                        placeholder="카테고리를 선택해주세요."
                    />
                    <CategoryDropdown
                        options={tags}
                        selected={selectedTag}
                        onChange={setSelectedTag}
                        placeholder="말머리를 선택해주세요."
                    />
                    {!editPost && (
                        <S.Div>
                            <S.CheckboxLabel>
                                <input type="checkbox" />
                            </S.CheckboxLabel>
                            <S.Label>익명으로 게시</S.Label>
                        </S.Div>
                    )}
                </S.ForRow>

                <S.ForRow>
                    <S.Title
                        placeholder="제목을 입력해주세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </S.ForRow>
            </S.Top>

            <S.MainContainer>
                <Markdown
                    textareaRef={textareaRef}
                    content={content}
                    setContent={setContent}
                />
                <S.WriteContainer>
                    <S.Write
                        ref={textareaRef}
                        placeholder="내용을 입력해주세요."
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => { isComposingRef.current = true; }}
                        onCompositionEnd={() => { isComposingRef.current = false; }}
                    />
                    <S.PreviewWrapper>
                        <S.Preview dangerouslySetInnerHTML={{ __html: rendered }} />
                        <S.Counter $isOver={isOverLimit}>
                            {content.length} / {MAX_LENGTH}
                        </S.Counter>
                    </S.PreviewWrapper>
                </S.WriteContainer>
            </S.MainContainer>

            <ConfirmModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onConfirm={handleConfirmPost}
                errorMessage={!isPostValid ? "카테고리, 제목, 내용을 모두 입력해주세요." : undefined}
            />
            <ConfirmModal
                open={isCancelModalOpen}
                message={"게시글 작성을 취소하시겠어요?\n입력중인 내용은 저장되지 않습니다."}
                onCancel={() => setIsCancelModalOpen(false)}
                onConfirm={() => navigate(-1)}
                confirmLabel="취소"
                confirmColor="#e05c5c"
            />
        </S.Container>
    );
}