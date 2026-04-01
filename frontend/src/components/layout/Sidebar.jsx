import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { 
  MdDashboard, 
  MdClass, 
  MdAssignment, 
  MdChecklist, 
  MdArticle, 
  MdPlaylistAddCheck 
} from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import "../../styles/sidebar.css";

const Sidebar = ({ collapsed }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <h3 style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
        {collapsed ? "LMS" : "LMS Menu"}
      </h3>

      {user.role === "student" && (
        <>
          <NavLink to="/student/dashboard" title="Dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdDashboard size={20} style={{ minWidth: "20px" }} /> <span className="text">Dashboard</span>
          </NavLink>
          <NavLink to="/student/browse-courses" title="Browse Courses" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdClass size={20} style={{ minWidth: "20px" }} /> <span className="text">Browse Courses</span>
          </NavLink>
          <NavLink to="/student/assignments" title="Assignments" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdAssignment size={20} style={{ minWidth: "20px" }} /> <span className="text">Assignments</span>
          </NavLink>
          <NavLink to="/student/available-tests" title="Available Tests" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdArticle size={20} style={{ minWidth: "20px" }} /> <span className="text">Available Tests</span>
          </NavLink>
        </>
      )}

      {user.role === "teacher" && (
        <>
          <NavLink to="/teacher/dashboard" title="Dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdDashboard size={20} style={{ minWidth: "20px" }} /> <span className="text">Dashboard</span>
          </NavLink>
          <NavLink to="/teacher/create-course" title="Create Course" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdClass size={20} style={{ minWidth: "20px" }} /> <span className="text">Create Course</span>
          </NavLink>
          <NavLink to="/teacher/assignments" title="Assignments" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdAssignment size={20} style={{ minWidth: "20px" }} /> <span className="text">Assignments</span>
          </NavLink>
          <NavLink to="/teacher/submissions" title="Submissions" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdChecklist size={20} style={{ minWidth: "20px" }} /> <span className="text">Submissions</span>
          </NavLink>
          <NavLink to="/teacher/my-courses" title="My Courses" className={({ isActive }) => isActive ? "active-link" : ""}>
            <FaGraduationCap size={20} style={{ minWidth: "20px" }} /> <span className="text">My Courses</span>
          </NavLink>
          <NavLink to="/teacher/create-test" title="Create Test" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdArticle size={20} style={{ minWidth: "20px" }} /> <span className="text">Create Test</span>
          </NavLink>
          <NavLink to="/teacher/manage-tests" title="Manage Tests" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdPlaylistAddCheck size={20} style={{ minWidth: "20px" }} /> <span className="text">Manage Tests</span>
          </NavLink>
        </>
      )}

    </div>
  );
};

export default Sidebar;