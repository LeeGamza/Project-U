import React from "react";
import styles from "../../_styles/MainPage.module.scss";
import Logo from "./logo";
import SearchBar from "./searchbar";
import CreatePostButton from "./createpostbutton";
import Notifications from "./notifications";
import Messages from "./messages";
import UserProfile from "./userprofile";
import DropdownMenu from "./dropdownmenu";

const TopBar: React.FC = () => {
    return (
        <header className={styles.header}>
                <Logo />
                <SearchBar />
                <CreatePostButton />
                <Notifications />
                <Messages />
                <UserProfile />
                <DropdownMenu />
        </header>
    );
};

export default TopBar;
