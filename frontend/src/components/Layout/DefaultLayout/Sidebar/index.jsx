import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleToggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside className={cx("sidebar")}>
      {/* Logo */}
      <div
        className={cx("sidebar__logo")}
        onClick={() => (window.location.href = "http://localhost:5173/")}
      >
        <img src="/logo.png" alt="Logo" className={cx("sidebar__logo-img")} />
        {isExpanded && (
          <div className={cx("sidebar__logo-text")}>
            <span>StudentLife</span>
            <img
              src="/logo-dots.png"
              alt="Decorative dots"
              className={cx("sidebar__logo-dots")}
            />
          </div>
        )}
      </div>
      {/* Danh sách menu */}
      <ul className={cx("sidebar__menu")}>
        <li className={cx("sidebar__submenu")}>
          <div className={cx("sidebar__submenu-title")}>
            {isExpanded ? (
              "Tổng quan"
            ) : (
              <hr style={{ width: "100%", marginRight: "15px" }} />
            )}
          </div>

          <ul className={cx("sidebar__submenu-list")}>
            <li
              className={cx("sidebar__submenu-item", { active: isActive("/") })}
              onClick={() => navigate("/")}
            >
              <Icon icon="tabler:home" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Trang chủ</span>
              )}
            </li>
          </ul>
        </li>
        <li className={cx("sidebar__submenu")}>
          <span className={cx("sidebar__submenu-title")}>
            {isExpanded ? (
              "Học tập"
            ) : (
              <hr style={{ width: "100%", marginRight: "15px" }} />
            )}
          </span>
          <ul className={cx("sidebar__submenu-list")}>
            <li
              className={cx("sidebar__submenu-item", {
                active: isActive("/schedule"),
              })}
              onClick={() => navigate("/schedule")}
            >
              <Icon icon="lucide:calendar" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Thời khóa biểu</span>
              )}
            </li>
            <li
              className={cx("sidebar__submenu-item", {
                active: isActive("/courses"),
              })}
              onClick={() => navigate("/courses")}
            >
              <Icon icon="tabler:folder" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Môn học</span>
              )}
            </li>
            <li
              className={cx("sidebar__submenu-item", {
                active: isActive("/projects"),
              })}
              onClick={() => navigate("/projects")}
            >
              <Icon icon="ri:team-line" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Đồ án</span>
              )}
            </li>
          </ul>
        </li>
        {/* <li className={cx("sidebar__submenu")}>
          <span className={cx("sidebar__submenu-title")}>
            {isExpanded ? (
              "Tài chính"
            ) : (
              <hr style={{ width: "100%", marginRight: "15px" }} />
            )}
          </span>
          <ul className={cx("sidebar__submenu-list")}>
            <li
              className={cx("sidebar__submenu-item", {
                active: isActive("/finance"),
              })}
              onClick={() => navigate("/finance")}
            >
              <Icon icon="tabler:home-dollar" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Chi phí nhóm</span>
              )}
            </li>
            <li
              className={cx("sidebar__submenu-item", {
                active: isActive("/debt"),
              })}
              onClick={() => navigate("/debt")}
            >
              <Icon icon="vaadin:book-dollar" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Khoản vay & nợ</span>
              )}
            </li>
          </ul>
        </li> */}
        <li className={cx("sidebar__submenu")}>
          <span className={cx("sidebar__submenu-title")}>
            {isExpanded ? (
              "Cài đặt"
            ) : (
              <hr style={{ width: "100%", marginRight: "15px" }} />
            )}
          </span>
          <ul className={cx("sidebar__submenu-list")}>
            <li
              className={cx("sidebar__submenu-item", {
                active: isActive("/notifications"),
              })}
              onClick={() => navigate("/notifications")}
            >
              <Icon icon="tabler:bell" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Thông báo</span>
              )}
            </li>
            <li
              className={cx("sidebar__submenu-item", {
                active: isActive("/settings"),
              })}
              onClick={() => navigate("/settings")}
            >
              <Icon icon="uil:setting" className={cx("sidebar__icon")} />
              {isExpanded && (
                <span className={cx("sidebar__content")}>Cài đặt</span>
              )}
            </li>
          </ul>
        </li>
      </ul>
      <div className={cx("sidebar__toggle")} onClick={handleToggleSidebar}>
        {isExpanded ? (
          <Icon icon="line-md:menu-fold-left" />
        ) : (
          <Icon icon="line-md:menu-fold-right" />
        )}
      </div>
    </aside>
  );
}
