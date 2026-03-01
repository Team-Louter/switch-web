import type { dComment } from '@/types/post';

export const dummyComments: dComment[] = [
  {
    id: 1,
    postId: 3,
    author: "backend_dev",
    content: "혹시 DB 드라이버 의존성은 제대로 추가하셨나요? pom.xml이나 build.gradle 확인해보세요.",
    createdAt: "2026-02-19T06:05:12.111Z"
  },
  {
    id: 2,
    postId: 3,
    author: "error_hunter",
    content: "로컬에서 테스트 중이시면 DB 서버(MySQL 등)가 실제로 실행 중인지도 체크해보시길!",
    createdAt: "2026-02-19T06:15:45.222Z"
  },
  {
    id: 3,
    postId: 3,
    author: "코린이1호", // 원작자 추가 질문
    content: "@backend_dev 네! 의존성은 넣었는데 계속 'Access denied for user'라고 뜨네요 ㅠㅠ",
    createdAt: "2026-02-19T06:20:30.333Z"
  },
  {
    id: 4,
    postId: 3,
    author: "java_master",
    content: "Access denied면 DB 계정 아이디나 비밀번호가 틀린 겁니다. application.yml 다시 확인하세요.",
    createdAt: "2026-02-19T06:45:10.444Z"
  },
  {
    id: 5,
    postId: 3,
    author: "spring_runner",
    content: "환경 변수(ENV)로 주입하고 계신 거면 오타가 났을 확률이 99%입니다.",
    createdAt: "2026-02-19T07:10:05.555Z"
  },
  {
    id: 6,
    postId: 3,
    author: "db_admin_kim",
    content: "권한 문제일 수도 있으니 GRANT 문으로 유저 권한 한 번 더 확인해보는 것도 방법이에요.",
    createdAt: "2026-02-19T07:30:22.666Z"
  },
  {
    id: 7,
    postId: 3,
    author: "코린이1호", // 해결 후 감사 인사
    content: "헉, 비밀번호에 특수문자 따옴표 처리를 안 해서 그랬네요! 해결됐습니다 다들 감사합니다!!",
    createdAt: "2026-02-19T08:12:44.777Z"
  },
  {
    id: 8,
    postId: 3,
    author: "backend_dev",
    content: "오 해결되셨다니 다행입니다! 즐코하세요 ㅎㅎ",
    createdAt: "2026-02-19T08:20:15.888Z"
  },

  // --- 2번 게시글 (정보 공유) 댓글 ---
  {
    id: 9,
    postId: 2,
    author: "frontend_lover",
    content: "로드맵 깔끔하네요. 북마크 해놓고 두고두고 보겠습니다!",
    createdAt: "2026-02-19T09:00:00.000Z"
  },
  {
    id: 10,
    postId: 2,
    author: "junior_dev",
    content: "Next.js 15 버전 기준으로 봐도 무방할까요?",
    createdAt: "2026-02-19T10:15:30.999Z"
  }
];