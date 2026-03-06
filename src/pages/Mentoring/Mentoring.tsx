import QuestionList from "./components/QuestionList";
import AvatarList from "./components/AvatarList";
import QnaList from "./components/QnaList";
import type { Comment } from "./components/types/Qna.type";
import type { AvatarItem } from "./components/types/AvatarList.type";
import type { Question } from "./components/types/QuestionList.type";
import userImg from "../../assets/dummy/userImg.png";
import QnaInput from "./components/QnaInput";
import * as S from "./Mentoring.styled";
import Add from "../../assets/mentoringImg/add.png";
import Category from "./components/Category";
import RoomModal from "./components/modal/RoomModal";
import type { AttachedImage } from "./components/types/QnaInput.type";
import { useState, useEffect, useCallback, useMemo } from "react";
import { mentoringApi } from "@/api/Mentoring";
import { getUser } from "@/api/User";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";

interface QuestionWithComments extends Question {
  comments: Comment[];
}

const formatDate = (date: string | Date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "오후" : "오전";
  const h = hours % 12 || 12;
  return `${month}.${day}. ${ampm} ${h}:${minutes}`;
};

export default function Mentoring() {
  const { user: authUser } = useAuthStore();
  const [role, setRole] = useState<"mentor" | "mentee" | "all">("mentor");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [questions, setQuestions] = useState<QuestionWithComments[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [isWritingNew, setIsWritingNew] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [editingRoom, setEditingRoom] = useState<AvatarItem | null>(null);
  const [isRoomsLoading, setIsRoomsLoading] = useState(false);

  // 기수 판단 및 역할 제한
  const myGeneration = useMemo(() => {
    if (authUser?.generation) return authUser.generation;
    if (me?.grade) return 4 - me.grade;
    return 0;
  }, [authUser, me]);

  const disabledRoles = useMemo(() => {
    if (myGeneration === 1) return ["mentee"] as ("mentor" | "mentee")[];
    if (myGeneration === 3) return ["mentor"] as ("mentor" | "mentee")[];
    return [] as ("mentor" | "mentee")[];
  }, [myGeneration]);

  const extractArray = useCallback((data: any): any[] => {
    if (!data) return [];
    
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    
    if (Array.isArray(data)) return data;
    if (data.content && Array.isArray(data.content)) return data.content;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, []);

  const fetchMyRooms = useCallback(async (currentMe: User, currentRole: string) => {
    setIsRoomsLoading(true);
    console.log("방 목록 조회 시작 - 현재 탭:", currentRole);

    try {
      const allRoomsRes = await mentoringApi.getMentorings();
      const roomsData = extractArray(allRoomsRes);
      console.log("1. 서버에서 받은 방 목록:", roomsData);
      
      const roomsWithMembership = await Promise.all(
        roomsData.map(async (room: any) => {
          try {
            const [leadersRaw, mentorsRaw, menteesRaw] = await Promise.all([
              mentoringApi.getMembers(room.mentoringId, "LEADER"),
              mentoringApi.getMembers(room.mentoringId, "MENTOR"),
              mentoringApi.getMembers(room.mentoringId, "MENTEE"),
            ]);
            
            const leaders = extractArray(leadersRaw);
            const mentors = extractArray(mentorsRaw);
            const mentees = extractArray(menteesRaw);
            const allMembersInRoom = [...leaders, ...mentors, ...mentees];
            
            // 본인을 제외한 멤버들
            const otherMembers = allMembersInRoom.filter(m => {
              const memberUserId = m.user?.userId || m.userId;
              return String(memberUserId) !== String(currentMe.userId);
            });

            // 멤버가 없어도 방 정보는 유지
            return {
              id: Number(room.mentoringId),
              roomId: Number(room.mentoringId),
              name: room.mentoringName || "이름 없는 방",
              type: otherMembers.length > 1 ? "batch" : "single",
              userImg: otherMembers[0]?.user?.profileImageUrl || userImg,
              users: otherMembers.map(m => ({
                id: m.user?.userId || m.userId,
                img: m.user?.profileImageUrl || m.profileImageUrl || userImg
              })),
            } as AvatarItem;
          } catch (err) {
            console.warn(`방(ID:${room.mentoringId}) 멤버 조회 실패, 기본 정보로 표시:`, err);
            return {
              id: Number(room.mentoringId),
              roomId: Number(room.mentoringId),
              name: room.mentoringName || "이름 없는 방",
              type: "single",
              userImg: userImg,
              users: [],
            } as AvatarItem;
          }
        })
      );
      
      const filteredRooms = roomsWithMembership.filter((r): r is AvatarItem => r !== null);
      console.log("2. 최종 매핑된 방 목록:", filteredRooms);
      setAvatars(filteredRooms);
      
      setSelectedRoomId(prev => {
        if (filteredRooms.length === 0) return null;
        if (!prev || !filteredRooms.some(r => r.id === prev)) return filteredRooms[0].id;
        return prev;
      });
    } catch (error) {
      console.error("방 목록 로딩 실패:", error);
    } finally {
      setIsRoomsLoading(false);
    }
  }, [extractArray]);

  // 내 정보 조회
  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getUser();
        setMe(userData);
        const gen = authUser?.generation || (4 - userData.grade);
        let initialRole: "mentor" | "mentee" = "mentor";
        if (gen === 1) initialRole = "mentor";
        else if (gen === 3) initialRole = "mentee";
        setRole(initialRole);
        
        fetchMyRooms(userData, initialRole);
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
      }
    };
    init();
  }, [authUser, fetchMyRooms]);

  // 역할(멘토/멘티 탭) 변경 시 방 목록 다시 필터링
  useEffect(() => {
    if (me) {
      fetchMyRooms(me, role);
    }
  }, [role, me, fetchMyRooms]);

  // 2. 방 선택 시 질문 목록 조회
  useEffect(() => {
    if (!selectedRoomId) {
      setQuestions([]);
      return;
    }
    const fetchQuestions = async () => {
      try {
        const res = await mentoringApi.getQuestions();
        const data = extractArray(res);
        const mappedQuestions: QuestionWithComments[] = data
          .filter((q: any) => Number(q.mentoringId) === Number(selectedRoomId))
          .map((q: any) => ({
            id: Number(q.questionId),
            roomId: Number(q.mentoringId),
            title: q.title,
            date: formatDate(q.createdAt),
            status: q.status === "DONE" ? "답변 완료" : q.status === "ACTIVE" ? "답변 중" : "답변 대기",
            comments: q.content ? [{
              id: q.questionId,
              userName: "질문자",
              content: q.content,
              time: formatDate(q.createdAt),
              profileUrl: userImg,
              images: q.files?.map((f: any) => f.fileUrl) || [],
              replies: [],
            }] : [],
          }));

        setQuestions(prev => {
          return mappedQuestions.map(newQ => {
            const existing = prev.find(p => p.id === newQ.id);
            return existing ? { ...newQ, comments: existing.comments } : newQ;
          });
        });
      } catch (error) {
        console.error("질문 목록 로딩 실패:", error);
      }
    };
    fetchQuestions();
  }, [selectedRoomId, extractArray]);

  // 3. 질문 선택 시 메시지 조회
  useEffect(() => {
    if (!selectedQuestionId || isWritingNew) return;

    const fetchMessages = async () => {
      try {
        const res = await mentoringApi.getMessages();
        const data = extractArray(res);
        const serverComments: Comment[] = data
          .filter((m: any) => Number(m.questionId) === Number(selectedQuestionId))
          .map((m: any) => ({
            id: Number(m.messageId),
            userName: m.userName || "익명",
            content: m.content,
            time: formatDate(m.createdAt),
            profileUrl: m.profileUrl || userImg,
            images: m.fileUrls || [],
            replies: [],
          }));

        if (serverComments.length > 0) {
          setQuestions(prev =>
            prev.map(q => {
              if (q.id !== selectedQuestionId) return q;
              const combined = [...q.comments];
              serverComments.forEach(sc => {
                if (!combined.some(pc => pc.id === sc.id)) combined.push(sc);
              });
              return { ...q, comments: combined.sort((a, b) => a.id - b.id) };
            })
          );
        }
      } catch (error) {
        console.error("메시지 로딩 실패:", error);
      }
    };
    fetchMessages();
  }, [selectedQuestionId, isWritingNew, extractArray]);

  const roomQuestions = selectedRoomId
    ? questions.filter(q => Number(q.roomId) === Number(selectedRoomId))
    : [];

  const handleSelectRoom = (item: AvatarItem) => {
    setSelectedRoomId(item.id);
    setSelectedQuestionId(null);
    setIsWritingNew(false);
  };

  const handleEditClick = (item: AvatarItem) => {
    setEditingRoom(item);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await mentoringApi.deleteMentoring(id);
      if (me) fetchMyRooms(me, role);
    } catch (error) {
      console.error("방 삭제 실패:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleCreateRoom = async (name: string, memberIds: number[]) => {
    try {
      await mentoringApi.createMentoring({ mentoringName: name, memberIds });
      if (me) fetchMyRooms(me, role);
    } catch (error) {
      console.error("방 생성 실패:", error);
    }
  };

  const handleUpdateRoom = async (id: number, name: string, memberIds: number[]) => {
    try {
      await mentoringApi.updateMentoring(id, { mentoringName: name, memberIds });
      if (me) fetchMyRooms(me, role);
    } catch (error) {
      console.error("방 수정 실패:", error);
    }
  };

  const handleAddButtonClick = () => {
    setIsWritingNew(true);
    setSelectedQuestionId(null);
  };

  const handleFirstSubmit = async (content: string, _images: AttachedImage[]) => {
    if (!selectedRoomId) return;
    try {
      const title = content.length > 20 ? content.slice(0, 20) + "..." : content;
      const res = await mentoringApi.createQuestion(selectedRoomId, title, content);
      
      const newQuestion: QuestionWithComments = {
        id: Number(res.questionId),
        roomId: Number(res.mentoringId),
        title: res.title,
        date: formatDate(res.createdAt),
        status: "답변 대기",
        comments: [
          {
            id: res.questionId,
            userName: me?.userName || "나",
            content: content,
            time: formatDate(res.createdAt),
            profileUrl: me?.profileImageUrl || userImg,
            images: res.files?.map((f: any) => f.fileUrl) || [],
            replies: [],
          },
        ],
      };
      setQuestions(prev => [newQuestion, ...prev]);
      setSelectedQuestionId(newQuestion.id);
      setIsWritingNew(false);
    } catch (error) {
      console.error("질문 등록 실패:", error);
    }
  };

  const handleReplySubmit = async (content: string, _images: AttachedImage[]) => {
    if (!selectedQuestionId) return;
    try {
      const res = await mentoringApi.createMessage(selectedQuestionId, content);
      const newComment: Comment = {
        id: Number(res.messageId),
        userName: me?.userName || "나",
        content: res.content,
        time: formatDate(res.createdAt),
        profileUrl: me?.profileImageUrl || userImg,
        images: res.fileUrls || [],
        replies: [],
      };
      setQuestions(prev =>
        prev.map(q =>
          q.id === selectedQuestionId
            ? { ...q, comments: [...q.comments, newComment] }
            : q
        )
      );
    } catch (error) {
      console.error("답변 등록 실패:", error);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await mentoringApi.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => Number(q.id) !== Number(id)));
      if (selectedQuestionId === id) {
        setSelectedQuestionId(null);
      }
    } catch (error) {
      console.error("질문 삭제 실패:", error);
    }
  };

  const handleUpdateStatus = async (status: "DONE") => {
    if (!selectedQuestionId) return;
    try {
      await mentoringApi.updateStatus(selectedQuestionId, status);
      setQuestions(prev =>
        prev.map(q => q.id === selectedQuestionId ? { ...q, status: "답변 완료" } : q)
      );
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
    }
  };

  const selectedQuestionObj = questions.find(q => q.id === selectedQuestionId) ?? null;

  return (
    <>
      <S.body>
        <S.CategoryWrap>
          <Category selected={role as "mentor" | "mentee"} onSelect={(r) => setRole(r)} disabledRoles={disabledRoles} />
          해당하는 역할을 선택해 주세요!
        </S.CategoryWrap>

        <S.container>
          <S.LeftArea>
            <S.AvatarContainer>
              <S.TitleAddContainer>
                {role === "mentee" && "멘토"}
                {role === "mentor" && (
                  <>
                    멘티
                    <S.AddButton src={Add} onClick={() => setIsModalOpen(true)} />
                  </>
                )}
              </S.TitleAddContainer>
              {isRoomsLoading ? (
                <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
              ) : (
                <AvatarList
                  data={avatars}
                  selectedId={selectedRoomId}
                  onSelect={handleSelectRoom}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteRoom}
                />
              )}
            </S.AvatarContainer>
            <S.QnaContainer>
              질문
              <S.QuestionListScroll>
                {roomQuestions.length > 0 ? (
                  <QuestionList
                    questions={roomQuestions}
                    selectedId={selectedQuestionId}
                    onSelect={(q) => {
                      setSelectedQuestionId(q.id);
                      setIsWritingNew(false);
                    }}
                    onDelete={handleDeleteQuestion}
                  />
                ) : (
                  <S.EmptyText>등록된 질문이 없어요.</S.EmptyText>
                )}
              </S.QuestionListScroll>
            </S.QnaContainer>
          </S.LeftArea>

          <S.RightContainer>
            {role === "mentee" && (
              <S.AddContainer>
                <S.AddButton src={Add} onClick={handleAddButtonClick} />
              </S.AddContainer>
            )}
            {role === "mentor" && selectedQuestionObj && selectedQuestionObj.status !== "답변 완료" && (
              <S.EndContainer>
                <S.EndWrap>
                  질문에 대한 답변이 끝났나요? 답변 완료 버튼을 눌러주세요.
                  <S.End onClick={() => handleUpdateStatus("DONE")}>답변완료</S.End>
                </S.EndWrap>
              </S.EndContainer>
            )}

            <S.QnaListWrapper>
              {(isWritingNew || selectedQuestionObj) ? (
                <QnaList comments={selectedQuestionObj?.comments ?? []} />
              ) : (
                <S.EmptyText>
                  {roomQuestions.length > 0 ? "선택된 질문이 없어요." : "등록된 질문이 없어요."}
                </S.EmptyText>
              )}
            </S.QnaListWrapper>

            {(isWritingNew || selectedQuestionObj) && (
              <QnaInput
                onSubmit={
                  role === "mentee"
                    ? isWritingNew
                      ? handleFirstSubmit
                      : handleReplySubmit
                    : handleReplySubmit
                }
              />
            )}
          </S.RightContainer>
        </S.container>

        <RoomModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onCreate={handleCreateRoom}
          onUpdate={handleUpdateRoom}
          initialData={editingRoom}
        />
      </S.body>
    </>
  );
}
