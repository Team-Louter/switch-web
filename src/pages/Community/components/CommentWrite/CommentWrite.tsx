import * as S from "./CommentWrite.styled";

interface CommentWriteProps {
    onClose?: () => void;
}

export default function CommentWrite({ onClose }: CommentWriteProps) {
    return (
        <S.CommentWrite>
            <S.CommentContent placeholder="댓글을 남겨보세요." />
            <S.ForRow>
                <S.Div style={{ gap: 10 }}>
                    <S.Div style={{ marginLeft: 10 }}>
                        <S.ProfileImg />
                        <S.Name>이도연</S.Name>
                    </S.Div>
                    <S.Div>
                        <S.CheckboxLabel>
                            <input type="checkbox" />
                        </S.CheckboxLabel>
                        <S.Label>익명으로 등록</S.Label>
                    </S.Div>
                </S.Div>
                <S.Confirm onClick={onClose}>등록</S.Confirm>
            </S.ForRow>
        </S.CommentWrite>
    );
}