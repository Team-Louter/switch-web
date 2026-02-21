import type { Comment, commentProps } from "@/types/post";
import * as S from "./Comment.styled";
import { formatDateTime } from "@/utils/FormatDate";

export default function Comment({comment}:commentProps) {
    return (
        <S.Container>
            <S.Div>
                <S.ProfileImg/>
                <S.ForColumn>
                    <S.Name>{comment.author}</S.Name>
                    <S.CommentContent>{comment.content}</S.CommentContent>
                    <S.Div>
                        <S.UploadTime>{formatDateTime(comment.createdAt)}</S.UploadTime>
                        <S.WriteButton>답글쓰기</S.WriteButton>
                    </S.Div>
                </S.ForColumn>
            </S.Div>
            <S.KebabIcon/>
        </S.Container>
    )
}