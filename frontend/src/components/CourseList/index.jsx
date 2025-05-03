import classNames from "classnames/bind";
import styles from "./CourseList.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export default function CourseList({ semesterData, handleClickCourse }) {
  return (
    <div className={cx("course-list")}>
      {semesterData.courses.map((course, index) => (
        <div
          key={index}
          className={cx("course-list_item")}
          onClick={() => handleClickCourse(course)}
        >
          <div className={cx("course-list_item-index")}>{index + 1}</div>
          <div className={cx("course-list_item-name")}>
            {course.name}
            <Icon icon="material-symbols:arrow-forward-ios-rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
