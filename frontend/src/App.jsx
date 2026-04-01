import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const CreateCourse = lazy(() => import("./pages/teacher/CreateCourse"));
const BrowseCourses = lazy(() => import("./pages/student/BrowseCourses"));
const Assignments = lazy(() => import("./pages/teacher/Assignments"));
const MyAssignments = lazy(() => import("./pages/student/MyAssignments"));
const ViewSubmissions = lazy(() => import("./pages/teacher/ViewSubmissions"));
const MyCourses = lazy(() => import("./pages/teacher/MyCourses"));
const CourseDetails = lazy(() => import("./pages/teacher/CourseDetails"));
const AssignmentDetails = lazy(() => import("./pages/student/AssignmentDetails"));
const CreateTest = lazy(() => import("./pages/teacher/CreateTest"));
const ManageTests = lazy(() => import("./pages/teacher/ManageTests"));
const EditTest = lazy(() => import("./pages/teacher/EditTest"));
const AvailableTests = lazy(() => import("./pages/student/AvailableTests"));
const TestEnvironment = lazy(() => import("./pages/student/TestEnvironment"));
const TestSummary = lazy(() => import("./pages/student/TestSummary"));
const ReviewAttempts = lazy(() => import("./pages/teacher/ReviewAttempts"));
const GradeAttempt = lazy(() => import("./pages/teacher/GradeAttempt"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ padding: "50px", textAlign: "center", fontSize: "1.2rem" }}>Loading App...</div>}>
        <Routes>

          {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRole="student" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/browse-courses" element={<BrowseCourses />} />
            <Route path="/student/assignments" element={<MyAssignments />} />
            <Route path="/student/assignment/:id" element={<AssignmentDetails />} />
            <Route path="/student/available-tests" element={<AvailableTests />} />
            <Route path="/student/test/:id" element={<TestEnvironment />} />
            <Route path="/student/test/:id/summary" element={<TestSummary />} />

          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRole="teacher" />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/create-course" element={<CreateCourse />} />
            <Route path="/teacher/assignments" element={<Assignments />} />
            <Route path="/teacher/submissions" element={<ViewSubmissions />} />
            <Route path="/teacher/my-courses" element={<MyCourses />} />
            <Route path="/teacher/course/:id" element={<CourseDetails />} />
            <Route path="/teacher/create-test" element={<CreateTest />} />
            <Route path="/teacher/edit-test/:id" element={<EditTest />} />
            <Route path="/teacher/manage-tests" element={<ManageTests />} />
            <Route path="/teacher/test/:testId/review" element={<ReviewAttempts />} />
            <Route path="/teacher/attempt/:attemptId/grade" element={<GradeAttempt />} />

          </Route>
        </Route>

      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;