import Layout from "../../components/Layout";
import ModuleCard from "../../components/cards/ModuleCard";
import { useState, useEffect } from "react";
import { getModules } from "../../services/shared.service";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserCoursePage = () => {
  const [modules, setModules] = useState([]);
  const { state } = useLocation();
  const { courseId, courseTitle } = state;

  useEffect(() => {
      async function initModules(){
          const recModules = await getModules(courseId);
          setModules(recModules)
      }
      initModules();
  }, [courseId, setModules])

  return (
    <Layout>
        <div className="mb-5">
        <h1>Курс "{courseTitle}"</h1>
        </div>

        <h3 className="mb-3">Разделы:</h3>
        <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
        {modules.length === 0 && (
            <div>Нет модулей</div>
        )}
        {modules.map((module) => (
            <ModuleCard
            key={module.id}
            id={module.id}
            title={module.name}
            canDelete={false}
            isStudent={true}
            />
        ))}
        </div>
    </Layout>
  );
};

export default UserCoursePage;