"use client";

import styles from "./_style/page.module.scss";
import Post from "./_component/post";
import Comment from "./_component/comment";
import { useRecoilState } from "recoil";
import { postState, commentsState } from "@/recoil/atoms";
import { fetchPost, fetchComments } from "@/lib/api";
import { useEffect } from "react";

// function getPost(id: string) {
//   const mockPosts: {
//     [key: string]: {
//       id: string;
//       title: string;
//       content: string;
//       images: string[];
//     };
//   } = {
//     "1": {
//       id: "1",
//       title: "첫 번째 글",
//       content:
//         "이것은 첫 번째 글의 내용입니다. ㅇㄹㄴ\n dfsfsojfi\niidjisoijfjoi\n",
//       images: ["/post1.jpg", "/post2.jpg", "/post3.jpg"],
//     },
//     "2": {
//       id: "2",
//       title: "두 번째 글",
//       content: "이것은 두 번째 글의 내용입니다.",
//       images: [],
//     },
//   };

//   return mockPosts[id] || null; // 함수 파라미터로 받은 id를 사용
// }

// const mockComments = [
//   {
//     id: 1,
//     user: {
//       profileImage: "/profile1.jpg",
//       nickname: "user_1",
//     },
//     content: "첫 번째 댓글입니다!",
//     timestamp: "2025.01.12. 12:01",
//   },
//   {
//     id: 2,
//     user: {
//       profileImage: "/profile2.jpg",
//       nickname: "user_2",
//     },
//     content: "두 번째 댓글이에요!",
//     timestamp: "2025.01.12. 12:05",
//   },
//   {
//     id: 3,
//     user: {
//       profileImage: "/profile3.jpg",
//       nickname: "user_3",
//     },
//     content:
//       "프랑스의 수도이자 최대도시. 순수 유럽국가 중에서 단일로는 영국 수도 런던, 독일 수도 베를린, 이탈리아 수도 로마에 이어 4번째로 큰 도시이지만, 광역권으로 보면 가장 큰 도시다. 영국 런던에 이어 독일 프랑크푸르트 등과 함께 유럽에서 손에 꼽히는 금융 허브이기도 하다. 또 오랜 역사에서 비롯한 예술과 패션과 유행의 도시로서 첫 손에 꼽히는데 루이비통, 샤넬, 에르메스 등 유수의 명품 회사들의 본사들이 위치해 있다.",
//     timestamp: "2025.01.12. 12:05",
//   },
//   {
//     id: 4,
//     user: {
//       profileImage: "/profile4.jpg",
//       nickname: "user_4",
//     },
//     content: "두 번째 댓글이에요!",
//     timestamp: "2025.01.12. 12:05",
//   },
// ];

export default function PostDetail({ params }: { params: { id: string } }) {
  //   const post = getPost(params.id);
  const [post, setPost] = useRecoilState(postState);
  const [comments, setComments] = useRecoilState(commentsState);

  useEffect(() => {
    async function loadData() {
      const postData = await fetchPost(params.id);
      const commentsData = await fetchComments(params.id);

      setPost(postData);
      setComments(commentsData);
    }

    loadData();
  }, [params.id, setPost, setComments]);

  if (!post) return <div>해당 게시글을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.background}>
      <div className={styles.postDetailContainer}>
        <Post post={post} />
        <div className={styles.line}></div>
        <div className={styles.comentContainer}>
          <div className={styles.comentTitle}>댓글</div>
          <div className={styles.line2}></div>
          <div className={styles.comment}>
            {comments.map((comment) => (
              <Comment
                key={comment.id} // key 설정
                user={comment.user}
                content={comment.content}
                timestamp={comment.timestamp}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
