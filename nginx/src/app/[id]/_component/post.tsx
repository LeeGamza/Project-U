"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import styles from "../_style/post.module.scss";
import Image from "next/image";
import { FiBookmark, FiStar } from "react-icons/fi";

export default function Post({
  post,
}: {
  post: { title: string; content: string; images: string[] };
}) {
  return (
    <div className={styles.postContentContainer}>
      <div className={styles.dateContainer}>
        <div className={styles.title}>{post.title}</div>
        <div className={styles.bookmark}>
          <div className={styles.date}>작성일 : 2025.01.01</div>
          <div>
            <FiBookmark className={styles.icons} />
            <FiStar className={styles.icons} />
          </div>
        </div>
      </div>
      {post.images?.length > 0 ? (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className={styles.swiper} // ✅ 스타일 적용
        >
          {post.images.map((src, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={800}
                height={450}
                objectFit="cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>이미지가 없습니다.</p>
      )}
      <div className={styles.profileContainer}>
        <Image
          src={"/profile1.jpg"}
          alt={"profile"}
          width={60}
          height={60}
          className={styles.profile}
        />
        <div className={styles.nickname}>user_1</div>
      </div>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}
