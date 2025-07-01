import { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import styles from "./TextEditor.module.scss";
import classNames from "classnames/bind";
import uploadService from "@services/uploadService";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

const TextEditor = ({ initialContent, onSave, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);
  const quill = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quill.current) {
      quill.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike"],
              ["link", "image", "video"],
              [{ align: [] }],
              ["blockquote", "code-block"],
              [{ color: [] }, { background: [] }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
      });
      quill.current.root.innerHTML = initialContent;
    }

    return () => {
      quill.current = null;
    };
  }, [initialContent]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const range = quill.current.getSelection();
      const reader = new FileReader();

      reader.onload = (e) => {
        const localImageUrl = e.target.result;
        quill.current.clipboard.dangerouslyPasteHTML(
          range.index,
          `<img src="${localImageUrl}" data-file-name="${file.name}"/>`
        );
      };

      reader.readAsDataURL(file);
    };
  };

  const handleSave = async () => {
    setIsUploading(true);
    let uploadFailed = false;

    const editorElem = quill.current.root;
    const images = editorElem.querySelectorAll("img");
    const uploadPromises = [];

    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src.startsWith("data:image")) {
        const fileName = img.getAttribute("data-file-name") || "image.png";

        const byteString = atob(src.split(",")[1]);
        const mimeString = src.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        const formData = new FormData();
        formData.append("file", blob, fileName);

        const uploadPromise = uploadService
          .uploadFile(formData)
          .then((res) => {
            img.setAttribute("src", res.data.data.fileUrl);
            img.removeAttribute("data-file-name");
          })
          .catch((err) => {
            console.error("Upload ảnh thất bại", err);
            uploadFailed = true;
          });

        uploadPromises.push(uploadPromise);
      }
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);

    if (uploadFailed) {
      alert("Một hoặc nhiều ảnh không thể tải lên. Vui lòng thử lại!");
      return;
    }

    const content = editorElem.innerHTML;
    onSave(content);
  };

  return (
    <div className={cx("text-editor__overlay")}>
      <div className={cx("text-editor__container")}>
        <div ref={editorRef} className={cx("text-editor__editor")}></div>
        <div className={cx("text-editor__actions")}>
          <button
            onClick={onCancel}
            className={cx("text-editor__button", "text-editor__button--cancel")}
            disabled={isUploading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className={cx("text-editor__button", "text-editor__button--save")}
            disabled={isUploading}
          >
            {isUploading ? (
              <Icon
                icon="line-md:loading-twotone-loop"
                className={cx("spinner")}
              />
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>

      {isUploading && (
        <div className={cx("text-editor__loading")}>
          <Icon
            icon="line-md:loading-twotone-loop"
            className={cx("spinner", "spinner--overlay")}
          />
          <span>Đang tải ảnh lên...</span>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
