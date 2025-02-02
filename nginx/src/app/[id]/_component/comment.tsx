import Image from "next/image";
import { FiStar } from "react-icons/fi";
import styles from "../_style/comment.module.scss";

type CommentProps = {
  user: {
    profileImage: string;
    nickname: string;
  };
  content: string;
  timestamp: string;
};

export default function Comment({ user, content, timestamp }: CommentProps) {
  return (
    <div className={styles.commentHoleContainer}>
      <div className={styles.commentUserInfo}>
        <div className={styles.userContainer}>
          <Image
            src={user.profileImage}
            alt="profile"
            width={40}
            height={40}
            className={styles.profile}
          />
          <div className={styles.nickname}>{user.nickname}</div>
          <div className={styles.commentTime}>{timestamp}</div>
        </div>
        <FiStar />
      </div>
      <div>{content}</div>
      <button className={styles.backCommentButton}>답글달기</button>
    </div>
  );
}
