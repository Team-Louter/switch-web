import { useState } from "react";
import * as S from "./CommunitySidebar.styled";
import { CATEGORIES } from "@/constants/Community";

export default function CommunitySidebar() {
    const [selectedCategory, setSelectedCategory] = useState("전체");

    return (
        <S.Container>
            <S.Title>카테고리</S.Title>
            {CATEGORIES.map((category) => (
                <S.Category
                    key={category}
                    $isSelected={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </S.Category>
            ))}
        </S.Container>
    );
}