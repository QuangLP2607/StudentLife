import Home from "../pages/Home";
import Login from "../pages/Login";
import Schedule from "../pages/Schedule";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import NewCourses from "../pages/NewCourse";
import Projects from "../pages/Projects/index";
import Finance from "../pages/Finance";
import Debt from "../pages/Debt";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, layout: null },
  { path: "/schedule", component: Schedule },
  { path: "/courses", component: Courses },
  { path: "/course/:course_id", component: CourseDetails },
  { path: "/semester-editor/:mode", component: NewCourses },
  { path: "/projects", component: Projects },
  { path: "/finance", component: Finance },
  { path: "/debt", component: Debt },
  { path: "/notifications", component: Notifications },
  { path: "/settings", component: Settings },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
