import { atom } from "recoil";

// 게시물 상태
export const postState = atom({
  key: "postState",
  default: null as Post | null, // 게시물이 없을 수도 있으니까 null로 초기화
});

// 댓글 상태
export const commentsState = atom({
  key: "commentsState",
  default: [] as Comment[],
});

// 타입 정의 (필요하면 확장 가능)
export interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
}

export interface Comment {
  id: number;
  user: {
    profileImage: string;
    nickname: string;
  };
  content: string;
  timestamp: string;
}
