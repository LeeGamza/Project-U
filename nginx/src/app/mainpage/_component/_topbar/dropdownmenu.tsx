import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import axios from "axios";
import styles from "../../_styles/MainPage.module.scss";

const DropdownMenu: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 드롭다운 토글 함수
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    // 외부 클릭 감지 로직
    useEffect(() => {
        const handleClickOutsideDropdown = (event: MouseEvent) => {
            if (
                !(event.target as HTMLElement).closest(`.${styles.dropdownMenu}`) &&
                !(event.target as HTMLElement).closest(`.${styles.dropdownIcon}`)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutsideDropdown);
        return () =>
            document.removeEventListener("click", handleClickOutsideDropdown);
    }, []);

    // 로그아웃 API 호출 핸들러
    const handleLogout = async () => {
        try {
            const response = await axios.get("/api/v1/users/logout");
            const result = response.data;
            if (result.status === 200) {
                window.location.href = "/login";
            } else {
                alert(`Logout failed: ${result.message}`);
            }
        } catch (err) {
            alert("로그아웃에 실패했습니다. 잠시 후에 다시 시도해주세요.");
            console.error(err);
        }
    };

    return (
        <div className={styles.dropdownContainer}>
            {/* 드롭다운 토글 버튼 */}
            <IoChevronDown
                className={styles.dropdownIcon}
                onClick={toggleDropdown}
            />

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                    <p
                        className={styles.dropdownItem}
                        onClick={() => (window.location.href = "/myprofile")}
                    >
                        My 프로필
                    </p>
                    <p className={styles.dropdownItem} onClick={handleLogout}>
                        로그아웃
                    </p>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
