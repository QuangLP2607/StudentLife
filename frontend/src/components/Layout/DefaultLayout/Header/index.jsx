import { useState, useRef, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { Icon } from "@iconify/react";
import avatar from "@/assets/avatar.svg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@contexts/UserContext";
import { SemesterContext } from "@contexts/SemesterContext";
import { PostsContext } from "@contexts/PostsContext";

const cx = classNames.bind(styles);

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { posts } = useContext(PostsContext);
  const { semester, currentWeek } = useContext(SemesterContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const menuRef = useRef();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSetting = () => {
    navigate("/settings");
  };

  const formatDate = (date) => {
    const days = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const day = days[date.getDay()];
    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDate = `${day}, ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    return `⏰ ${formattedTime} - ${formattedDate}`;
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getMatchedSnippet = (content, term) => {
    const plainText = stripHtmlTags(content);
    const index = plainText.toLowerCase().indexOf(term.toLowerCase());

    if (index === -1) return plainText.slice(0, 50) + "...";

    const start = Math.max(0, index - 20);
    const end = Math.min(plainText.length, index + term.length + 20);

    return (
      (start > 0 ? "..." : "") +
      plainText.slice(start, end) +
      (end < plainText.length ? "..." : "")
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = posts.filter((post) => {
      const plainContent = stripHtmlTags(post.content);
      return (
        post.title.toLowerCase().includes(value.toLowerCase()) ||
        plainContent.toLowerCase().includes(value.toLowerCase())
      );
    });

    setSuggestions(filtered.slice(0, 5));
  };

  const handleSelectSuggestion = (post) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/course/${post.course_id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatDate(now));
    }, 1000);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={cx("header")}>
      {/* Search */}
      <div className={cx("header__search")}>
        <div className={cx("header__search-wrapper")}>
          <input
            value={searchTerm}
            onChange={handleSearchChange}
            className={cx("header__search-input")}
            placeholder="Tìm kiếm tài liệu"
          />
          <Icon icon="mage:search" className={cx("header__search-icon")} />

          {suggestions.length > 0 && (
            <div className={cx("header__suggestions")}>
              {suggestions.map((post) => (
                <div
                  key={post.id}
                  className={cx("header__suggestion-item")}
                  onClick={() => handleSelectSuggestion(post)}
                >
                  <div className={cx("header__suggestion-title")}>
                    {post.title}
                  </div>
                  <div className={cx("header__suggestion-content")}>
                    {getMatchedSnippet(post.content, searchTerm)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thông tin kỳ học và thời gian */}
      {semester && (
        <div className={cx("header__info")}>
          <div>
            📅 Tuần {currentWeek} – Kỳ {semester.name}
          </div>
          <div>{currentTime}</div>
        </div>
      )}

      {/* Actions */}
      <div className={cx("header__actions")}>
        <div className={cx("header__actions-bell")}>
          <Icon icon="iconoir:bell" />
        </div>
        <div
          className={cx("header__actions-avatar-wrap")}
          onClick={() => setShowMenu(!showMenu)}
        >
          <img
            className={cx("header__actions-avatar")}
            src={user?.avatar || avatar}
            alt="Avatar"
          />
        </div>

        {showMenu && (
          <div className={cx("header__dropdown")} ref={menuRef}>
            <div
              className={cx("header__dropdown-item")}
              onClick={handleSetting}
            >
              <Icon icon="uil:setting" /> Cài đặt
            </div>
            <hr className={cx("header__dropdown-line")} />
            <div className={cx("header__dropdown-item")} onClick={handleLogout}>
              <Icon icon="material-symbols:logout" /> Đăng xuất
            </div>
          </div>
        )}

        <div className={cx("header__actions-name")}>{user?.name}</div>
      </div>
    </div>
  );
}
