import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PostEditor.module.scss";
import { Icon } from "@iconify/react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import dayjs from "dayjs";
import postService from "@services/postService";
import uploadService from "@services/uploadService";
import ConfirmModal from "@components/ConfirmModal";
import CustomDropdown from "@/components/CustomDropdown";

const cx = classNames.bind(styles);

export default function PostEditor() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quill = useRef(null);

  const [posts, setPosts] = useState([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Khởi tạo Quill editor với handler file chỉ chèn base64, không upload
  const initEditor = () => {
    if (!editorRef.current || quill.current) return;

    quill.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike"],
            ["link", "image", "file"],
            [{ align: [] }],
            ["blockquote", "code-block"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
          ],
          handlers: {
            file: () => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "*/*");
              input.click();

              input.onchange = () => {
                const file = input.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                  const base64 = e.target.result;
                  const range = quill.current.getSelection(true);
                  if (file.type.startsWith("image/")) {
                    quill.current.insertEmbed(range.index, "image", base64);
                    quill.current.setSelection(range.index + 1);
                  } else {
                    quill.current.insertText(
                      range.index,
                      file.name,
                      "link",
                      base64
                    );
                    quill.current.setSelection(range.index + file.name.length);
                  }
                };
                reader.readAsDataURL(file);
              };
            },
          },
        },
      },
    });
  };

  // Lấy danh sách bài đăng từ server
  const fetchPosts = useCallback(async () => {
    try {
      const res = await postService.getPosts({ courseId: course_id });
      setPosts(res.data.data.posts);
    } catch (err) {
      console.error("Lỗi khi lấy bài đăng:", err);
    }
  }, [course_id]);

  // Hàm upload ảnh base64 trong nội dung editor lên server, thay thế src base64 bằng URL thật
  const uploadBase64Images = async (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");

    for (let img of images) {
      if (img.src.startsWith("data:")) {
        const blob = await fetch(img.src).then((r) => r.blob());
        const file = new File([blob], "image.png", { type: blob.type });
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadService.uploadFile(formData, course_id);
        const url = res.data.data.fileUrl || res.data.data.imageUrl;
        img.src = url;
      }
    }

    return doc.body.innerHTML;
  };

  // Hàm upload các link base64 trong nội dung là file thường (không phải ảnh)
  // Chúng ta cần tìm các thẻ a có href bắt đầu bằng "data:" và upload tương tự, thay href thành URL thật
  const uploadBase64Links = async (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const links = doc.querySelectorAll("a");

    for (let a of links) {
      if (a.href.startsWith("data:")) {
        // fetch file từ base64
        const blob = await fetch(a.href).then((r) => r.blob());
        // lấy tên file từ textContent (tên file được chèn khi insertText)
        const fileName = a.textContent || "file";
        const file = new File([blob], fileName, { type: blob.type });
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadService.uploadFile(formData, course_id);
        const url = res.data.data.fileUrl || res.data.data.imageUrl;
        a.href = url;
        a.setAttribute("target", "_blank"); // mở link mới
        a.setAttribute("rel", "noopener noreferrer");
      }
    }

    return doc.body.innerHTML;
  };

  // Hàm xử lý upload tất cả base64 (ảnh + link file) trước khi lưu bài
  const uploadAllBase64 = async (html) => {
    let updatedHtml = await uploadBase64Images(html);
    updatedHtml = await uploadBase64Links(updatedHtml);
    return updatedHtml;
  };

  // Lưu bài đăng, upload file base64 trước rồi mới gọi API lưu bài
  const handleSavePost = async () => {
    const title = newPostTitle.trim();
    let content = quill.current?.root.innerHTML;

    if (!title || !content || content === "<p><br></p>") {
      alert("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    try {
      content = await uploadAllBase64(content);

      const newPost = {
        title,
        content,
        week: 2, // TODO: chọn tuần đúng
        course_id: course_id,
        posted_at: new Date().toISOString(),
      };

      await postService.addPost(newPost);
      alert("Đã lưu bài đăng!");
      setNewPostTitle("");
      quill.current.root.innerHTML = "";
      setIsAddingPost(false);
      quill.current = null;
      await fetchPosts();
    } catch (error) {
      alert("Lỗi khi lưu bài đăng: " + error.message);
    }
  };

  const handleCancel = () => {
    const isEmpty =
      !newPostTitle.trim() || quill.current?.root.innerHTML === "<p><br></p>";
    if (isEmpty) confirmCancel();
    else setIsModalOpen(true);
  };

  const confirmCancel = () => {
    setNewPostTitle("");
    if (quill.current?.root) quill.current.root.innerHTML = "";
    quill.current = null;
    setIsAddingPost(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (isAddingPost) initEditor();
  }, [isAddingPost]);

  const filteredPosts =
    selectedWeek === "all"
      ? posts
      : posts.filter((p) => p.week === Number(selectedWeek));

  return (
    <div className={cx("posts")}>
      <button
        className={cx("posts__btn-back")}
        onClick={() => navigate("/courses")}
      >
        <Icon icon="material-symbols:arrow-back-ios-rounded" />
        Tất cả môn học
      </button>

      {!isAddingPost ? (
        <div className={cx("posts__add")} onClick={() => setIsAddingPost(true)}>
          Thêm bài đăng mới
        </div>
      ) : (
        <div className={cx("posts__form")}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className={cx("posts__form-title")}
              placeholder="Nhập tiêu đề"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <button className={cx("posts__form-cancel")} onClick={handleCancel}>
              <Icon icon="tabler:x" />
            </button>
          </div>
          <hr />
          <div
            ref={editorRef}
            className={cx("posts__form-content")}
            style={{ minHeight: 200 }}
          />
          <div className={cx("posts__form-actions")}>
            <button className={cx("posts__form-save")} onClick={handleSavePost}>
              Lưu
            </button>
          </div>
        </div>
      )}

      <div className={cx("posts__filter")}>
        <label>Lọc theo tuần: </label>
        <div className={cx("posts__filter--dropdown")}>
          <CustomDropdown
            options={[
              { label: "Tất cả", value: "all" },
              ...[...Array(16)].map((_, i) => ({
                label: `Tuần ${i + 1}`,
                value: `${i + 1}`,
              })),
            ]}
            selectedValue={selectedWeek}
            onChange={(value) => setSelectedWeek(value)}
          />
        </div>
      </div>

      <div className={cx("posts__list")}>
        {filteredPosts.length === 0 ? (
          <p>Không có bài đăng nào.</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className={cx("posts__item")}>
              <div className={cx("posts__item-header")}>
                <div className={cx("posts__item-header-title")}>
                  {post.title}
                </div>
                <em className={cx("posts__item-header-week")}>
                  Tuần {post.week}
                </em>
              </div>
              <hr />
              <div
                className={cx("posts__item-content")}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <hr />
              <em className={cx("posts__item-time")}>
                Đăng lúc: {dayjs(post.posted_at).format("DD/MM/YYYY HH:mm")}
              </em>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <ConfirmModal
          title="Xác nhận"
          message="Bạn có chắc muốn hủy bỏ? Mọi thay đổi chưa lưu sẽ mất."
          onConfirm={confirmCancel}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
