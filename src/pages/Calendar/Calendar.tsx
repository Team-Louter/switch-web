import CommonCalendar from "@/components/common/Calendar/Calendar";
import * as S from "./Calendar.styled"

export default function Calendar() {
  
    return (
        <>
            <S.Container>
                <S.CalendarDiv>
                    <CommonCalendar />
                </S.CalendarDiv>
            </S.Container>
        </>
    )
}