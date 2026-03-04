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
import { useState, useEffect, useCallback } from "react";
import { mentoringApi } from "@/api/Mentoring";
import { getUser } from "@/api/User";
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
  const [role, setRole] = useState<"mentor" | "mentee">("mentor");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [questions, setQuestions] = useState<QuestionWithComments[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [isWritingNew, setIsWritingNew] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [editingRoom, setEditingRoom] = useState<AvatarItem | null>(null);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId) ?? null;

  const extractArray = useCallback((resData: any): any[] => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (resData.data && Array.isArray(resData.data)) return resData.data;
    if (resData.content && Array.isArray(resData.content)) return resData.content;
    return [];
  }, []);

  const extractSingle = useCallback((resData: any): any => {
    if (!resData) return null;
    if (resData.data) return resData.data;
    if (resData.content) return resData.content;
    return resData;
  }, []);

  // 내 정보 조회
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const userData = await getUser();
        setMe(userData);
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
      }
    };
    fetchMe();
  }, []);

  // 1. 방 목록 조회 — 최초 1회
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await mentoringApi.getMentorings();
        const data = extractArray(res.data);
        const rooms: AvatarItem[] = data.map((room: any) => ({
          id: Number(room.mentoringId),
          roomId: Number(room.mentoringId),
          name: room.mentoringName,
          type: "single",
          userImg: userImg,
        }));
        setAvatars(rooms);
        if (rooms.length > 0) {
          setSelectedRoomId(rooms[0].id);
        }
      } catch (error) {
        console.error("방 목록 로딩 실패:", error);
      }
    };
    fetchRooms();
  }, [extractArray]); // selectedRoom 의존성 완전 제거

  // 2. 방 선택 시 질문 목록 조회
  useEffect(() => {
    if (!selectedRoomId) return;
    const fetchQuestions = async () => {
      try {
        const res = await mentoringApi.getQuestions();
        const data = extractArray(res.data);
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
              images: q.fileUrls || [],
              replies: [],
            }] : [],
          }));

        setQuestions(prev =>
          mappedQuestions.map(newQ => {
            const existing = prev.find(p => p.id === newQ.id);
            return existing ? { ...newQ, comments: existing.comments } : newQ;
          })
        );
      } catch (error) {
        console.error("질문 목록 로딩 실패:", error);
      }
    };
    fetchQuestions();
  }, [selectedRoomId, extractArray]); // id만 의존

  // 3. 질문 선택 시 메시지 조회
  useEffect(() => {
    if (!selectedQuestionId || isWritingNew) return;

    const fetchMessages = async () => {
      try {
        const res = await mentoringApi.getMessages();
        const data = extractArray(res.data);
        const serverComments: Comment[] = data
          .filter((m: any) => Number(m.questionId) === Number(selectedQuestionId))
          .map((m: any) => ({
            id: Number(m.messageId),
            userName: m.userName,
            content: m.content,
            time: formatDate(m.createdAt),
            profileUrl: m.profileUrl || userImg,
            images: m.images || [],
            replies: [],
          }));
          
          console.log("createQuestion raw 응답:", res);
          console.log("createQuestion res.data:", res.data);
          const actualData = extractSingle(res.data);
          console.log("createQuestion actualData:", actualData);

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
      setAvatars(prev => prev.filter(a => a.id !== id));
      if (selectedRoomId === id) {
        setSelectedRoomId(null);
        setSelectedQuestionId(null);
      }
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
      const res = await mentoringApi.createMentoring({ mentoringName: name, memberIds });
      const actualData = extractSingle(res.data);
      const newAvatar: AvatarItem = {
        id: Number(actualData.mentoringId),
        roomId: Number(actualData.mentoringId),
        name: actualData.mentoringName,
        type: memberIds.length > 1 ? "batch" : "single",
        ...(memberIds.length > 1
          ? { users: memberIds.map(id => ({ id, img: userImg })) }
          : { userImg: userImg }),
      } as AvatarItem;
      setAvatars(prev => [...prev, newAvatar]);
      setSelectedRoomId(newAvatar.id);
    } catch (error) {
      console.error("방 생성 실패:", error);
    }
  };

  const handleUpdateRoom = async (id: number, name: string, memberIds: number[]) => {
    try {
      await mentoringApi.updateMentoring(id, { mentoringName: name, memberIds });
      setAvatars(prev => prev.map(a => a.id === id ? { ...a, name } : a));
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
      const res = await mentoringApi.createQuestion(
        selectedRoomId,
        content.length > 20 ? content.slice(0, 20) + "..." : content,
        content
      );
      const actualData = extractSingle(res.data);
      const newQuestion: QuestionWithComments = {
        id: Number(actualData.questionId || Date.now()),
        roomId: Number(actualData.mentoringId || selectedRoomId),
        title: actualData.title || (content.length > 20 ? content.slice(0, 20) + "..." : content),
        date: formatDate(actualData.createdAt || new Date()),
        status: "답변 대기",
        comments: [
          {
            id: Date.now(),
            userName: me?.userName || "나",
            content: content,
            time: formatDate(new Date()),
            profileUrl: me?.profileImageUrl || userImg,
            images: [],
            replies: [],
          },
        ],
      };
      console.log("createQuestion 응답:", actualData);
      setQuestions(prev => [newQuestion, ...prev]);
      setSelectedQuestionId(newQuestion.id);
      setIsWritingNew(false);
    } catch (error) {
      console.error("질문 등록 실패:", error);
    }
  };

  const handleReplySubmit = async (content: string, _images: AttachedImage[]) => {
    if (!selectedQuestion) return;
    try {
      const res = await mentoringApi.createMessage(
        selectedQuestion.id,
        content
      );
      const actualData = extractSingle(res.data);
      const newComment: Comment = {
        id: Number(actualData.messageId || Date.now()),
        userName: actualData.userName || me?.userName || "나",
        content: actualData.content || content,
        time: formatDate(actualData.createdAt || new Date()),
        profileUrl: actualData.profileUrl || me?.profileImageUrl || userImg,
        images: actualData.images || [],
        replies: [],
      };
      setQuestions(prev =>
        prev.map(q =>
          q.id === selectedQuestion.id
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
    if (!selectedQuestion) return;
    try {
      await mentoringApi.updateStatus(selectedQuestion.id, status);
      setQuestions(prev =>
        prev.map(q => q.id === selectedQuestion.id ? { ...q, status: "답변 완료" } : q)
      );
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
    }
  };

  return (
    <>
      <S.body>
        <S.CategoryWrap>
          <Category selected={role} onSelect={setRole} />
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
              <AvatarList
                data={avatars}
                selectedId={selectedRoomId}
                onSelect={handleSelectRoom}
                onEdit={handleEditClick}
                onDelete={handleDeleteRoom}
              />
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
            {role === "mentor" && selectedQuestion && selectedQuestion.status !== "답변 완료" && (
              <S.EndContainer>
                <S.EndWrap>
                  질문에 대한 답변이 끝났나요? 답변 완료 버튼을 눌러주세요.
                  <S.End onClick={() => handleUpdateStatus("DONE")}>답변완료</S.End>
                </S.EndWrap>
              </S.EndContainer>
            )}

            <S.QnaListWrapper>
              {(isWritingNew || selectedQuestion) ? (
                <QnaList comments={selectedQuestion?.comments ?? []} />
              ) : (
                <S.EmptyText>
                  {roomQuestions.length > 0 ? "선택된 질문이 없어요." : "등록된 질문이 없어요."}
                </S.EmptyText>
              )}
            </S.QnaListWrapper>

            {(isWritingNew || selectedQuestion) && (
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