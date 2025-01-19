import styles from "./_styles/page.module.scss";

export default function Post() {
  return (
    <div className={styles.background}>
      {/* <Topbar /> */}
      <div className={styles.textEditButtonBar}>
        <button>뒤로가기</button>
        <button>여행장소</button>
        <button>사진 첨부하기</button>
        <button>굵은 글씨체</button>
        <button>기울임 글씨체</button>
        <button>텍스트 색깔</button>
        <button>게시물 올리기</button>
      </div>
    </div>
  );
}
