import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AuthGuard from "./components/AuthGuard";
import AdminPage from "./pages/AdminPage";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import ModulePage from "./pages/ModulePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<AuthGuard><CoursesPage /></AuthGuard>} />
        <Route path="/course" element={<AuthGuard><CoursePage /></AuthGuard>} />
        <Route path="/module" element={<AuthGuard><ModulePage /></AuthGuard>} />
        <Route path="/users" element={<AuthGuard><AdminPage /></AuthGuard>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
