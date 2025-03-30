import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AuthGuard from "./components/AuthGuard";
import AdminPage from "./pages/AdminPage";

import CoursesPage from "./pages/teacherPages/CoursesPage";
import CoursePage from "./pages/teacherPages/CoursePage";
import ModulePage from "./pages/teacherPages/ModulePage";
import MakeTestPage from "./pages/teacherPages/MakeTestPage";

import UserCoursesPage from "./pages/studentPages/UserCoursesPage";
import UserCoursePage from "./pages/studentPages/UserCoursePage";
import UserModulePage from "./pages/studentPages/UserModulePage";
import UserTestPage from "./pages/studentPages/UserTestPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<AuthGuard><AdminPage /></AuthGuard>} />

        <Route path="/courses" element={<AuthGuard><CoursesPage /></AuthGuard>} />
        <Route path="/course" element={<AuthGuard><CoursePage /></AuthGuard>} />
        <Route path="/module" element={<AuthGuard><ModulePage /></AuthGuard>} />
        <Route path="/makeTest" element={<AuthGuard><MakeTestPage /></AuthGuard>} />

        <Route path="/userCourses" element={<AuthGuard><UserCoursesPage /></AuthGuard>} />
        <Route path="/userCourse" element={<AuthGuard><UserCoursePage /></AuthGuard>} />
        <Route path="/userModule" element={<AuthGuard><UserModulePage /></AuthGuard>} />
        <Route path="/test" element={<AuthGuard><UserTestPage /></AuthGuard>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
