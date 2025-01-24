import styles from "./_styles/page.module.scss";
import TopEditBar from "./_component/topEditBar";
import { FiSearch } from "react-icons/fi";

export default function Post() {
  return (
    <div className={styles.background}>
      {/* <Topbar /> */}
      <TopEditBar />
      <div className={styles.postContainer}>
        <div className={styles.searchContainer}>
          <div className={styles.textAreaContainer}>
            <textarea
              className={styles.textArea}
              placeholder="어디로 여행을 가셨나요?"
            ></textarea>
            <FiSearch className={styles.FiSearch} />
          </div>
        </div>
        <div className={styles.postEditContainer}>
          <div className={styles.postEditContainer}>
            <textarea className={styles.textArea2} placeholder="제목" />
            <div className={styles.line}></div>
            <textarea
              className={styles.textArea3}
              placeholder="여러분들의 경험을 마음껏 펼쳐보세요!"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
