import * as S from "./Comment.styled";

export default function Comment() {
    return (
        <S.Container>
            <S.Div>
                <S.ProfileImg/>
                <S.ForColumn>
                    <S.Name>싸가지 없는 곰</S.Name>
                    <S.CommentContent>이세돌 월드 투어 하길래 보기위해서 미국 왔따!!</S.CommentContent>
                    <S.Div>
                        <S.UploadTime>26.01.07. 09:15</S.UploadTime>
                        <S.WriteButton>답글쓰기</S.WriteButton>
                    </S.Div>
                </S.ForColumn>
            </S.Div>
            <S.KebabIcon/>
        </S.Container>
    )
}