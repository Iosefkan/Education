import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AuthGuard from "./components/AuthGuard";
import AdminPage from "./pages/AdminPage";

import CoursesPage from "./pages/teacherPages/CoursesPage";
import CoursePage from "./pages/teacherPages/CoursePage";
import ModulePage from "./pages/teacherPages/ModulePage";
import MakePracticalPage from "./pages/teacherPages/MakePracticalPage";
import MakeTaskPage from "./pages/teacherPages/MakeTaskPage";
import MakeTheoryMaterialPage from "./pages/teacherPages/MakeTheoryMaterialPage";

import UserCoursesPage from "./pages/studentPages/UserCoursesPage";
import UserCoursePage from "./pages/studentPages/UserCoursePage";
import UserModulePage from "./pages/studentPages/UserModulePage";
import UserPracticalPage from "./pages/studentPages/UserPracticalPage";
import UserTheoryMaterialPage from "./pages/studentPages/UserTheoryMaterialPage"
import UserTaskPage from "./pages/studentPages/UserTaskPage"
import TestProtocolPage from "./pages/teacherPages/TestProtocolPage";
import UserProtocolPage from "./pages/studentPages/UserProtocolPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<AuthGuard><AdminPage /></AuthGuard>} />

        <Route path="/courses" element={<AuthGuard><CoursesPage /></AuthGuard>} />
        <Route path="/course" element={<AuthGuard><CoursePage /></AuthGuard>} />
        <Route path="/module" element={<AuthGuard><ModulePage /></AuthGuard>} />
        <Route path="/makeTest" element={<AuthGuard><MakePracticalPage /></AuthGuard>} />
        <Route path="/makeTheory" element={<AuthGuard><MakeTheoryMaterialPage /></AuthGuard>} />
        <Route path="/makeTask" element={<AuthGuard><MakeTaskPage /></AuthGuard>} />
        <Route path="/testProtocol" element={<AuthGuard><TestProtocolPage/></AuthGuard>}/>

        <Route path="/userCourses" element={<AuthGuard><UserCoursesPage /></AuthGuard>} />
        <Route path="/userCourse" element={<AuthGuard><UserCoursePage /></AuthGuard>} />
        <Route path="/userModule" element={<AuthGuard><UserModulePage /></AuthGuard>} />
        <Route path="/test" element={<AuthGuard><UserPracticalPage /></AuthGuard>} />
        <Route path="/theory" element={<AuthGuard><UserTheoryMaterialPage /></AuthGuard>} />
        <Route path="/task" element={<AuthGuard><UserTaskPage /></AuthGuard>} />
        <Route path="/userProtocol" element={<AuthGuard><UserProtocolPage /></AuthGuard>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
