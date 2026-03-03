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
import { useState } from "react";

interface QuestionWithComments extends Question {
  comments: Comment[];
}

const dummyComments: Comment[] = [
  {
    id: 1,
    userName: "멘토A",
    content: "이 부분은 이렇게 접근하는 게 좋아요.",
    time: "01.15. 오후 6:40",
    images: [userImg],
    profileUrl: userImg,
    replies: [
      {
        id: 2,
        userName: "멘티B",
        content:
          "음\n```tsx\nexport function QnaItem({ comment, isReply = false }: Props) {\n ``` \n 아 진짜 어렵네\n ```tsx\nexport function QnaItem({ comment, isReply = false }: Props) {\n ```",
        time: "01.15. 오후 6:45",
        profileUrl: userImg,
        replies: [],
      },
      {
        id: 3,
        userName: "멘토A",
        content: "내일 할 일:최초 질문 크기 확대하기.",
        time: "01.15. 오후 6:47",
        profileUrl: userImg,
        replies: [],
      },
    ],
  },
];

const dummyAvatars: AvatarItem[] = [
  {
    id: 1,
    roomId: 1,
    type: "single",
    name: "이도연 멘토",
    userImg,
  },
  {
    id: 2,
    roomId: 2,
    type: "batch",
    name: "9기 멘토",
    users: [
      { id: 1, img: userImg },
      { id: 2, img: userImg },
      { id: 3, img: userImg },
      { id: 4, img: userImg },
    ],
  },
];

const DUMMY_QUESTIONS: QuestionWithComments[] = [
  {
    id: 1,
    roomId: 1,
    title: "CRUD가 뭐예요?",
    date: "01.15. 오후 7:01",
    status: "답변 중",
    comments: dummyComments,
  },
  {
    id: 2,
    roomId: 2,
    title: "REST API가 뭐예요?",
    date: "01.16. 오후 3:00",
    status: "답변 완료",
    comments: [],
  },
];

const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "오후" : "오전";
  const h = hours % 12 || 12;
  return `${month}.${day}. ${ampm} ${h}:${minutes}`;
};

export default function Mentoring() {
  const [role, setRole] = useState<"mentor" | "mentee">("mentor");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithComments[]>(DUMMY_QUESTIONS);
  // 첫 번째 아바타 기본 선택
  const [selectedRoom, setSelectedRoom] = useState<AvatarItem>(dummyAvatars[0]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionWithComments | null>(null);
  const [isWritingNew, setIsWritingNew] = useState(false);

  const roomQuestions = questions.filter((q) => q.roomId === selectedRoom.roomId);

  const handleSelectRoom = (item: AvatarItem) => {
    setSelectedRoom(item);
    setSelectedQuestion(null);
    setIsWritingNew(false);
  };

  const handleAddButtonClick = () => {
    setIsWritingNew(true);
    setSelectedQuestion(null);
  };

  const handleFirstSubmit = (content: string, images: AttachedImage[]) => {
    const newQuestion: QuestionWithComments = {
      id: Date.now(),
      roomId: selectedRoom.roomId,
      title: content.length > 20 ? content.slice(0, 20) + "..." : content,
      date: formatDate(new Date()),
      status: "답변 대기",
      comments: [
        {
          id: Date.now(),
          userName: "나",
          content,
          time: formatDate(new Date()),
          profileUrl: userImg,
          images: images.map((img) => img.url),
          replies: [],
        },
      ],
    };
    setQuestions((prev) => [newQuestion, ...prev]);
    setSelectedQuestion(newQuestion);
    setIsWritingNew(false);
  };

  const handleReplySubmit = (content: string, images: AttachedImage[]) => {
    if (!selectedQuestion) return;
    const newReply: Comment = {
      id: Date.now(),
      userName: "나",
      content,
      time: formatDate(new Date()),
      profileUrl: userImg,
      images: images.map((img) => img.url),
      replies: [],
    };
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestion.id
          ? {
              ...q,
              comments: q.comments.map((c, i) =>
                i === 0 ? { ...c, replies: [...c.replies, newReply] } : c,
              ),
            }
          : q,
      ),
    );
    setSelectedQuestion((prev) =>
      prev
        ? {
            ...prev,
            comments: prev.comments.map((c, i) =>
              i === 0 ? { ...c, replies: [...c.replies, newReply] } : c,
            ),
          }
        : prev,
    );
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
                data={dummyAvatars}
                selectedId={selectedRoom.id}
                onSelect={handleSelectRoom}
              />
            </S.AvatarContainer>
            <S.QnaContainer>
              질문
              <S.QuestionListScroll>
                {roomQuestions.length > 0 ? (
                  <QuestionList
                    questions={roomQuestions}
                    selectedId={selectedQuestion?.id ?? null}
                    onSelect={(q) => {
                      setSelectedQuestion(q as QuestionWithComments);
                      setIsWritingNew(false);
                    }}
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
            {role === "mentor" && (
              <S.EndContainer>
                <S.EndWrap>
                  질문에 대한 답변이 끝났나요? 답변 완료 버튼을 눌러주세요.
                  <S.End>답변완료</S.End>
                </S.EndWrap>
              </S.EndContainer>
            )}

            <S.QnaListWrapper>
              {role === "mentee" && (isWritingNew || selectedQuestion) && (
                <QnaList
                  comments={
                    questions.find((q) => q.id === selectedQuestion?.id)?.comments ?? []
                  }
                />
              )}
              
              {role === "mentee" && !isWritingNew && !selectedQuestion && (
                <S.EmptyText>선택된 질문이 없어요.</S.EmptyText>
              )}
              {role === "mentor" && <QnaList comments={dummyComments} />}
            </S.QnaListWrapper>

            {(role === "mentor" || isWritingNew || selectedQuestion) && (
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

        <RoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </S.body>
    </>
  );
}