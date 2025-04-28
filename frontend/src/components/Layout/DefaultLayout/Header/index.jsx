import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { Icon } from "@iconify/react";
import avatar from "@/assets/avatar.svg"; // Avatar mặc định
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../contexts/UserContext";

const cx = classNames.bind(styles);

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSetting = () => {
    // Chuyển đến trang cài đặt
    navigate("/settings");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cx("header")}>
      {/* Search */}
      <div className={cx("header__search")}>
        <input
          className={cx("header__search-input")}
          placeholder="Tìm kiếm tài liệu"
        />
        <Icon icon="mage:search" className={cx("header__search-icon")} />
      </div>
      {/* info */}
      <div className={cx("header__info")}>
        <div>📅 Tuần 3 - Kỳ 20242</div>
        <div>⏰ 12:43 - Thứ 4, 3/2/2025</div>
      </div>
      {/* actions */}
      <div className={cx("header__actions")}>
        <div>
          <div className={cx("header__actions-bell")}>
            <Icon icon="iconoir:bell" />
          </div>
        </div>
        <div
          className={cx("header__actions-avatar-wrap")}
          onClick={() => setShowMenu(!showMenu)}
        >
          {/* Avatar người dùng */}
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
