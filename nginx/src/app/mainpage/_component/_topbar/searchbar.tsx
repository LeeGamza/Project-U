import React from "react";
import { IoIosSearch } from "react-icons/io";
import styles from "../../_styles/MainPage.module.scss";

const SearchBar: React.FC = () => (
                    <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="도시 검색"
                                className={styles.searchInput}
                            />
                            <IoIosSearch className={styles.searchIcon}/></div>
);
export default SearchBar;



