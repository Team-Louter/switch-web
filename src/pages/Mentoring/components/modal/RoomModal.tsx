import { useState, useMemo, useEffect } from "react";
import * as S from "./RoomModal.styled";
import cancelIcon from "../../../../assets/mentoringImg/cancel.png";
import MemberList from "./member/MemberList";
import Search from "../SearchBar/SearchBar";
import type { GradeGroup, Member } from "./member/member.type";
import type { AvatarItem } from "../../components/types/AvatarList.type";
import { mentoringApi } from "@/api/Mentoring";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, memberIds: number[]) => void;
  onUpdate?: (id: number, name: string, memberIds: number[]) => void;
  initialData?: AvatarItem | null;
}

const toGradeGroups = (members: Member[]): GradeGroup[] => {
  const gradeMap = new Map<number, Member[]>();
  members.forEach(m => {
    if (!gradeMap.has(m.grade)) gradeMap.set(m.grade, []);
    gradeMap.get(m.grade)!.push(m);
  });
  return Array.from(gradeMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([grade, members]) => ({ grade, members }));
};

export default function RoomModal({ isOpen, onClose, onCreate, onUpdate, initialData }: RoomModalProps) {
  if (!isOpen) return null;

  const [groups, setGroups] = useState<GradeGroup[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ALL");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (!isOpen) return;
    setSearchValue("");
    setSelectedRole("ALL");

    const loadMembers = async () => {
      setIsLoading(true);
      try {
        // 전체 멤버 목록
        const allMembersData = await mentoringApi.getAllMembers();
        const allMembers: Member[] = allMembersData.map(m => ({
          id: m.userId,
          name: m.userName,
          grade: m.grade,
          class: m.classRoom,
          number: m.number,
          role: m.role === "LEADER" ? "부장 (Leader)" : m.role === "MENTOR" ? "멘토 (Mentor)" : "멘티 (Mentee)",
          checked: false,
          profileImageUrl: m.profileImageUrl,
        }));

        if (isEditMode && initialData) {
          setRoomName(initialData.name);

          // 기존 멤버 체크 상태 반영
          try {
            const [leaders, mentors, mentees] = await Promise.all([
              mentoringApi.getMembers(initialData.id, "LEADER"),
              mentoringApi.getMembers(initialData.id, "MENTOR"),
              mentoringApi.getMembers(initialData.id, "MENTEE"),
            ]);
            const existingIds = new Set([
              ...leaders.map(m => m.user.userId),
              ...mentors.map(m => m.user.userId),
              ...mentees.map(m => m.user.userId),
            ]);
            const membersWithCheck = allMembers.map(m => ({
              ...m,
              checked: existingIds.has(m.id),
            }));
            setGroups(toGradeGroups(membersWithCheck));
          } catch {
            setGroups(toGradeGroups(allMembers));
          }
        } else {
          setRoomName("");
          setGroups(toGradeGroups(allMembers));
        }
      } catch (error) {
        console.error("멤버 목록 로딩 실패:", error);
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [isOpen, initialData?.id]);

  const checkedGrades = useMemo(
    () =>
      new Set(
        groups
          .filter(({ members }) => members.length > 0 && members.every(m => m.checked))
          .map(({ grade }) => grade),
      ),
    [groups],
  );

  const isSearching = searchValue.trim() !== "" || selectedRole !== "ALL";
  const filteredGroups = groups.map(g => ({
    ...g,
    members: g.members.filter(m => {
      const matchesSearch = m.name.includes(searchValue) || String(m.number).includes(searchValue);
      const matchesRole = selectedRole === "ALL" || 
        (selectedRole === "LEADER" && m.role.includes("Leader")) ||
        (selectedRole === "MENTOR" && m.role.includes("Mentor")) ||
        (selectedRole === "MENTEE" && m.role.includes("Mentee"));
      return matchesSearch && matchesRole;
    }),
  }));
  const flatSearchResults = filteredGroups.flatMap(g => g.members);
  const selectedMembers = groups.flatMap(g => g.members).filter(m => m.checked);
  const selectedCount = selectedMembers.length;

  const handleToggleMember = (id: number) => {
    setGroups(prev =>
      prev.map(g => ({
        ...g,
        members: g.members.map(m => m.id === id ? { ...m, checked: !m.checked } : m),
      }))
    );
  };

  const handleToggleGrade = (grade: number) => {
    const isAllChecked = checkedGrades.has(grade);
    setGroups(prev =>
      prev.map(g =>
        g.grade === grade
          ? { ...g, members: g.members.map(m => ({ ...m, checked: !isAllChecked })) }
          : g,
      )
    );
  };

  const handleClearAll = () => {
    setGroups(prev =>
      prev.map(g => ({ ...g, members: g.members.map(m => ({ ...m, checked: false })) }))
    );
  };

  const handleCreate = () => {
    if (!roomName.trim()) return;
    const memberIds = selectedMembers.map(m => m.id);
    if (isEditMode && initialData && onUpdate) {
      onUpdate(initialData.id, roomName, memberIds);
    } else {
      onCreate(roomName, memberIds);
    }
    setRoomName("");
    onClose();
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.container onClick={e => e.stopPropagation()}>
        <S.TitleCancelContainer>
          <S.Wrapper />
          <S.Title>{isEditMode ? "멘토링 방 수정" : "멘토링 방 생성"}</S.Title>
          <S.Cancel src={cancelIcon} onClick={onClose} />
        </S.TitleCancelContainer>

        <S.RoomName
          placeholder="방 제목을 입력해 주세요."
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
        />

        <S.AddMemberContainer>
          {isLoading ? (
            <div>멤버 목록 불러오는 중...</div>
          ) : (
            <MemberList
              groups={filteredGroups}
              flatSearchResults={isSearching ? flatSearchResults : null}
              onToggleMember={handleToggleMember}
              onToggleGrade={handleToggleGrade}
              checkedGrades={checkedGrades}
              selectedCount={selectedCount}
              onClearAll={handleClearAll}
              searchSlot={<Search onSearch={setSearchValue} />}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />
          )}
        </S.AddMemberContainer>

        <S.DoneButton onClick={handleCreate}>
          {isEditMode ? "수정 완료" : "생성"}
        </S.DoneButton>
      </S.container>
    </S.Overlay>
  );
}