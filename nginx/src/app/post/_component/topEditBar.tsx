import {
  FiArrowLeft,
  FiSearch,
  FiImage,
  FiBold,
  FiItalic,
  FiEdit3,
  FiUpload,
} from "react-icons/fi";
import styles from "../_styles/topEditBar.module.scss";

export default function TopEditBar() {
  return (
    <div className={styles.textEditButtonBar}>
      <button className={styles.backButton}>
        <FiArrowLeft className={styles.backArrow} />
        뒤로가기
      </button>
      <button className={styles.tripButton}>
        <img
          src="/googleMaps.png"
          alt="구글 문양"
          className={styles.googleMaps}
        />
        여행장소
        <FiSearch className={styles.FiSearch} />
      </button>
      <div className={styles.editButtonContainer}>
        <button className={styles.imageButton}>
          <FiImage className={styles.FiImage} />
          사진 첨부하기
        </button>
        <button className={styles.imageButton}>
          <FiBold className={styles.FiImage} />
          굵은 글씨체
        </button>
        <button className={styles.imageButton}>
          <FiItalic className={styles.FiImage} />
          기울임 글씨체
        </button>
        <button className={styles.imageButton}>
          <FiEdit3 className={styles.FiImage} />
          텍스트 색깔
        </button>
      </div>
      <div className={styles.uploadContainer}>
        <button className={styles.backButton}>
          <FiUpload className={styles.backArrow} />
          게시물 올리기
        </button>
      </div>
    </div>
  );
}
