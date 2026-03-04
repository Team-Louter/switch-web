import instance from "./Axios";

export interface MentoringResponse {
  mentoringId: number;
  mentoringName: string;
  createdAt: string;
}

export interface MentoringRequest {
  mentoringName: string;
  memberIds?: number[];
}

export interface MentoringMember {
  memberId: number;
  user: {
    userId: number;
    userName: string;
    profileImageUrl: string;
    role: "LEADER" | "MENTOR" | "MENTEE";
    grade: number;
    classRoom: number;
    number: number;
  };
  role: "LEADER" | "MENTOR" | "MENTEE";
}

export interface MemberResponse {
  userId: number;
  userName: string;
  profileImageUrl: string;
  role: "LEADER" | "MENTOR" | "MENTEE";
  generation: number;
  grade: number;
  classRoom: number;
  number: number;
}

export interface QuestionResponse {
  questionId: number;
  mentoringId: number;
  userId: number;
  title: string;
  content: string;
  status: "PAUSED" | "ACTIVE" | "DONE";
  fileUrls: string[];
  createdAt: string;
}

export interface MessageResponse {
  messageId: number;
  questionId: number;
  userId: number;
  content: string;
  fileUrls: string[];
  createdAt: string;
}

export const mentoringApi = {
  // 멘토링 방 관련
  getMentorings: () =>
    instance.get<MentoringResponse[]>("/mentoring"),

  createMentoring: (data: MentoringRequest) =>
    instance.post<MentoringResponse>("/mentoring", data),

  updateMentoring: (mentoringId: number, data: MentoringRequest) =>
    instance.put<MentoringResponse>(`/mentoring/${mentoringId}`, data),

  deleteMentoring: (mentoringId: number) =>
    instance.delete(`/mentoring/${mentoringId}`),

  getMembers: (mentoringId: number, role: "LEADER" | "MENTOR" | "MENTEE") =>
    instance.get<MentoringMember[]>(`/mentoring/${mentoringId}/members`, { params: { role } }),

  // 전체 멤버 목록 (방 생성 시 멤버 선택용)
  getAllMembers: (generation?: number, keyword?: string) =>
    instance.get<MemberResponse[]>("/members", { params: { generation, keyword } }),

  // 질문 관련
  getQuestions: () =>
    instance.get<QuestionResponse[]>("/mentoring/questions"),

  createQuestion: (mentoringId: number, title: string, content: string) =>
    // instance.post<QuestionResponse>("/mentoring/questions", {
    //   request: { mentoringId, title, content }
    // }),
    instance.post("/mentoring/questions", { mentoringId, title, content }),

  updateStatus: (questionId: number, status: "PAUSED" | "ACTIVE" | "DONE") =>
    instance.patch(`/mentoring/questions/${questionId}/status`, null, { params: { status } }),

  deleteQuestion: (questionId: number) =>
    instance.delete(`/mentoring/questions/${questionId}`),

  // 메시지(답변) 관련
  getMessages: () =>
    instance.get<MessageResponse[]>("/mentoring/messages"),

  createMessage: (questionId: number, content: string) =>
    instance.post<MessageResponse>("/mentoring/messages", {
      request: { questionId, content }
    }),

  deleteMessage: (messageId: number) =>
    instance.delete(`/mentoring/messages/${messageId}`),
};