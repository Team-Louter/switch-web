import Calendar from "@/components/common/Calendar/Calendar";
import * as S from "./Main.styled.ts"

export default function Main() {
    return (
        <>
            <S.Container>
                <S.CalendarDiv>
                    <Calendar/>
                </S.CalendarDiv>
            </S.Container>
        </>
    )
}