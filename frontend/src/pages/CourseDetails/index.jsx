import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./CourseDetails.module.scss";
import PostEditor from "./Component/PostEditor";
import { Icon } from "@iconify/react";
import uploadService from "@/services/uploadService";
import semesterService from "@/services/semesterService";
import "react-quill/dist/quill.snow.css";

const cx = classNames.bind(styles);

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#556270",
  "#C7F464",
  "#FF6F91",
  "#845EC2",
  "#D65DB1",
  "#FF9671",
  "#00C9A7",
  "#0081CF",
];

function hashStringToNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function CourseDetails() {
  const [activeDocTab, setActiveDocTab] = useState("images");
  const [fileList, setFileList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // <-- state ảnh đang xem
  const { course_id } = useParams();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await semesterService.getCourseDetail(course_id);
        setCourse(res.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin course:", err);
      }
    }
    if (course_id) fetchCourse();
  }, [course_id]);

  useEffect(() => {
    if (activeDocTab === "images" || activeDocTab === "files") {
      uploadService
        .getFileList(course_id)
        .then((res) => {
          setFileList(res.data.data.files);
        })
        .catch((err) => {
          console.error("Lỗi lấy danh sách file:", err);
          setFileList([]);
        });
    }
  }, [activeDocTab, course_id]);

  const getTwoChars = (str) => {
    if (!str) return "";
    const words = str.trim().split(" ");
    const firstChar = words[0]?.charAt(0).toUpperCase() || "";
    const secondChar = words[1]?.charAt(0).toUpperCase() || "";
    return firstChar + secondChar;
  };

  const getColorByCourse = (course) => {
    if (!course) return "#ccc";
    const key = course.name || course.id.toString();
    const index = hashStringToNumber(key) % colors.length;
    return colors[index];
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const imageFormats = ["jpg", "jpeg", "png", "gif", "webp"];
  const filteredFiles = fileList.filter((file) => {
    const ext = file.format?.toLowerCase() || "";
    if (activeDocTab === "images") return imageFormats.includes(ext);
    if (activeDocTab === "files") return !imageFormats.includes(ext);
    return false;
  });

  // Hàm đóng modal
  const closeModal = () => setSelectedImage(null);

  return (
    <div className={cx("container")}>
      <PostEditor />

      <button
        className={cx("scroll-to-top")}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <Icon icon="material-symbols:arrow-upward" width={24} height={24} />
      </button>

      <div className={cx("documents")}>
        {course && (
          <div className={cx("courses")}>
            <div
              className={cx("courses-avatar")}
              style={{ backgroundColor: getColorByCourse(course) }}
            >
              {getTwoChars(course.name)}
            </div>
            <div className={cx("courses-info")}>
              <div className={cx("courses-name")}>{course.name}</div>
            </div>
          </div>
        )}
        <hr style={{ width: "100%" }} />
        <div className={cx("documents__tabs")}>
          <button
            className={cx("documents__tabs-btn", {
              active: activeDocTab === "images",
            })}
            onClick={() => setActiveDocTab("images")}
          >
            Ảnh
          </button>
          <button
            className={cx("documents__tabs-btn", {
              active: activeDocTab === "files",
            })}
            onClick={() => setActiveDocTab("files")}
          >
            File
          </button>
        </div>
        <div className={cx("documents__content")}>
          {filteredFiles.length === 0 ? (
            <p>Không có tài liệu phù hợp.</p>
          ) : activeDocTab === "images" ? (
            <div className={cx("files-grid")}>
              {filteredFiles.map((file) => (
                <button
                  key={file.filename}
                  className={cx("file-image")}
                  title={file.originalFilename || file.filename}
                  onClick={() => setSelectedImage(file.url)}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={file.url}
                    alt={file.originalFilename || file.filename}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className={cx("files-list")}>
              {filteredFiles.map((file) => (
                <div key={file.filename} className={cx("file-link")}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <div className={cx("file-link__wrapper")}>
                      <Icon
                        icon="mdi:file-document-outline"
                        width={24}
                        height={24}
                      />
                      <span className={cx("file-link__name")}>
                        {file.originalFilename || file.filename}
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal hiển thị ảnh lớn */}
      {selectedImage && (
        <div
          className={cx("modal-overlay")}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div
            className={cx("modal-content")}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={cx("modal__close-btn")}
              onClick={closeModal}
              aria-label="Close image preview"
            >
              &times;
            </button>

            {/* Ảnh lớn */}
            <img
              src={selectedImage}
              alt="Preview"
              className={cx("modal__main-image")}
            />

            <hr className={cx("modal__divider")} />

            {/* Dãy ảnh thumbnail */}
            <div className={cx("modal__thumbnails")}>
              {filteredFiles.map((file) => {
                const url = file.url;
                const isActive = url === selectedImage;
                return (
                  <img
                    key={file.filename}
                    src={url}
                    alt={file.originalFilename || file.filename}
                    className={cx("modal__thumbnail", {
                      "modal__thumbnail--active": isActive,
                    })}
                    onClick={() => setSelectedImage(url)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
