import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { SemesterContext } from "@contexts/SemesterContext";
import CourseCalendar from "@components/CourseCalendar";
import CourseList from "@components/CourseList";
import TextEditor from "@components/TextEditor";
import ConfirmModal from "@components/ConfirmModal";
import semesterService from "@services/semesterService";
import noteService from "@services/noteService";
import { Icon } from "@iconify/react";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  const { semesterId } = useContext(SemesterContext);
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [notes, setNotes] = useState([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [pendingNoteId, setPendingNoteId] = useState(null);

  const navigate = useNavigate();
  const [semester, setSemester] = useState(null);

  useEffect(() => {
    async function fetchSemesters() {
      try {
        const response = await semesterService.getSemesterDetail(semesterId);
        setSemester(response.data.data.semester);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết kỳ học:", err);
      }
    }

    fetchSemesters();
  }, [semesterId]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await noteService.getNotes();
        setNotes(res.data.data.notes);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ghi chú:", error);
      }
    }

    fetchNotes();
  }, []);

  const handleStart = () => {
    navigate("/semester-editor/new");
  };

  const handleAddNote = () => {
    setEditingNoteId("temp");
    setEditorContent("");
    setEditorVisible(true);
  };

  const handleEditNote = async (newContent) => {
    try {
      if (editingNoteId === "temp") {
        const tempNote = {
          id: "temp",
          content: "",
        };
        setNotes([tempNote, ...notes]);
        const res = await noteService.addNote(newContent);
        const newNote = res.data.data.note;
        setNotes((prevNotes) => {
          const filtered = prevNotes.filter((note) => note.id !== "temp");
          return [newNote, ...filtered];
        });
      } else {
        await noteService.updateNote(editingNoteId, { content: newContent });

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId ? { ...note, content: newContent } : note
          )
        );
      }

      setEditorVisible(false);
      setEditingNoteId(null);
      setModalType(null);
      setPendingNoteId(null);
    } catch (error) {
      alert("Không thể lưu ghi chú");
      console.error(error);
    }
  };

  const handleDeleteNote = (noteId) => {
    setModalType("deleteNote");
    setPendingNoteId(noteId);
    setModalOpen(true);
  };

  const handleCancelEditor = () => {
    setModalType("cancelEdit");
    setModalOpen(true);
  };

  const confirmModal = async () => {
    if (modalType === "deleteNote" && pendingNoteId) {
      try {
        await noteService.deleteNote(pendingNoteId);
        setNotes(notes.filter((note) => note.id !== pendingNoteId));
      } catch (error) {
        alert("Không thể xoá ghi chú");
        console.error(error);
      }
    }

    if (modalType === "cancelEdit") {
      setEditorVisible(false);
      setEditingNoteId(null);
    }

    setModalOpen(false);
    setModalType(null);
    setPendingNoteId(null);
  };

  const cancelModal = () => {
    setModalOpen(false);
    setModalType(null);
    setPendingNoteId(null);
  };

  const handleEditClick = () => {
    navigate("/semester-editor/edit", { state: { semester: semester } });
  };

  const handleEditButtonClick = (note) => {
    setEditorVisible(true);
    setEditingNoteId(note.id);
    setEditorContent(note.content);
  };

  const handleClickCourse = (course) => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div className={cx("home")}>
      {semester ? (
        <>
          <CourseCalendar semester={semester} />
          <div className={cx("home__content")}>
            <div className={cx("notes")}>
              <div className={cx("notes__edit")}>
                <button
                  className={cx("notes__edit--btn")}
                  onClick={handleAddNote}
                >
                  Thêm ghi chú
                  <Icon icon="uiw:plus-square-o" />
                </button>
              </div>
              <div className={cx("notes__list")}>
                {notes.map((note) => (
                  <div key={note.id} className={cx("notes__item")}>
                    <div className={cx("notes__item--action")}>
                      <button
                        className={cx("notes__item--action--btn")}
                        onClick={() => handleEditButtonClick(note)}
                      >
                        <Icon icon="solar:pen-new-square-linear" width="20" />
                      </button>
                      <button
                        className={cx("notes__item--action--btn")}
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Icon icon="solar:trash-bin-trash-bold" width="20" />
                      </button>
                    </div>

                    <div
                      className={cx("notes__item--content")}
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={cx("home__content--divider")} />

            <div className={cx("dashboard")}>
              <div
                className={cx("dashboard__edit-button")}
                onClick={handleEditClick}
              >
                Chỉnh sửa
                <Icon icon="solar:pen-new-square-linear" />
              </div>
              <div className={cx("dashboard__info")}>
                <div>Kỳ {semester.name}</div>
              </div>

              <hr className={cx("dashboard__separator")} />
              <div className={cx("dashboard__title")}>Danh sách môn học</div>
              <div className={cx("dashboard__course-list")}>
                <CourseList
                  semester={semester}
                  handleClickCourse={handleClickCourse}
                />
              </div>

              <hr className={cx("dashboard__separator")} />
              <div className={cx("dashboard__title")}>Danh sách project</div>
              <div className={cx("dashboard__course-list")}>
                {/* Danh sách project sẽ được xử lý sau */}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={cx("home__welcome")}>
          <h2>Chào mừng bạn đến với ứng dụng hỗ trợ sinh viên!</h2>
          <span>
            Ứng dụng giúp bạn quản lý thời khóa biểu, tài liệu học tập và chi
            tiêu một cách dễ dàng.
          </span>
          <br />
          <span>Hãy bắt đầu bằng cách thêm kỳ học đầu tiên.</span>
          <br />
          <button
            className={cx("home__welcome--start-btn")}
            onClick={handleStart}
          >
            Bắt đầu
          </button>
        </div>
      )}

      {isEditorVisible && (
        <TextEditor
          initialContent={editorContent}
          onSave={handleEditNote}
          onCancel={handleCancelEditor}
        />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title={
          modalType === "deleteNote"
            ? "Xác nhận xóa ghi chú"
            : "Xác nhận hủy chỉnh sửa"
        }
        message={
          modalType === "deleteNote"
            ? "Bạn có chắc muốn xóa ghi chú này?"
            : "Bạn có chắc muốn hủy thao tác chỉnh sửa/thêm ghi chú?"
        }
        onConfirm={confirmModal}
        onCancel={cancelModal}
      />
    </div>
  );
}
