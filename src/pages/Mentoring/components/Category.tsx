import * as S from "./styles/Category.styled";

type Props = {
  selected: "mentor" | "mentee";
  onSelect: (role: "mentor" | "mentee") => void;
  disabledRoles?: ("mentor" | "mentee")[];
};

export default function Category({ selected, onSelect, disabledRoles = [] }: Props) {
  const isMentorDisabled = disabledRoles.includes("mentor");
  const isMenteeDisabled = disabledRoles.includes("mentee");

  return (
    <S.Container>
      <S.Item
        $active={selected === "mentor"}
        onClick={() => !isMentorDisabled && onSelect("mentor")}
        style={{ 
          opacity: isMentorDisabled ? 0.3 : 1, 
          cursor: isMentorDisabled ? "not-allowed" : "pointer",
          pointerEvents: isMentorDisabled ? "none" : "auto"
        }}
      >
        멘토
      </S.Item>

      <S.Item
        $active={selected === "mentee"}
        onClick={() => !isMenteeDisabled && onSelect("mentee")}
        style={{ 
          opacity: isMenteeDisabled ? 0.3 : 1, 
          cursor: isMenteeDisabled ? "not-allowed" : "pointer",
          pointerEvents: isMenteeDisabled ? "none" : "auto"
        }}
      >
        멘티
      </S.Item>
    </S.Container>
  );
}