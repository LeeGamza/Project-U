import React from "react";
import styles from "../../_styles/MainPage.module.scss";

const CreatePostButton: React.FC = () => (
            <button
                className={styles.createPostButton}
                onClick={() => (window.location.href = "/post")}
            >+ 새로운 게시물 만들기
            </button>
            );

            export default CreatePostButton;
