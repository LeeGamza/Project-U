import axios from "axios";
import { Post, Comment } from "@/recoil/atoms";

export const fetchPost = async (postId: string): Promise<Post | null> => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/posts/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error("게시물 불러오기 오류:", error);
    return null;
  }
};

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/posts/${postId}/comments`
    );
    return response.data;
  } catch (error) {
    console.error("댓글 불러오기 오류:", error);
    return [];
  }
};
