import Calendar from "@/components/common/Calendar/Calendar";
import * as S from "./Main.styled.ts"
import Profile from "./components/Profile/Profile.tsx";
import { dummyMembers } from "@/constants/dummy.ts";
import { getGenerations } from "@/utils/FormatFilters.ts";
import { useState } from "react";

export default function Main() {
    const [selectedGen, setSelectedGen] = useState<string>("전체");
    return (
        <>
            <S.Container>
                <S.Scroll>
                    <S.CalendarDiv>
                        <Calendar/>
                    </S.CalendarDiv>

                    <S.ForColumn>
                        <Profile/>
                    </S.ForColumn>
                </S.Scroll>

                <S.Line/>

                <S.MemberContainer>
                    <S.Title>Louter Member</S.Title>
                    <S.FilterContainer>
                        {getGenerations(dummyMembers).map((gen) => (
                            <S.GenFilter
                                key={gen}
                                onClick={() => setSelectedGen(gen)}
                                $isSelected={selectedGen === gen}>{gen}</S.GenFilter>
                        ))}
                    </S.FilterContainer>
                </S.MemberContainer>
            </S.Container>
        </>
    )
}