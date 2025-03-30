import Layout from "../../components/Layout";
import TestCard from "../../components/TestCard";
import { getTests } from "../../services/student.service";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserModulePage = () => {
    const [tests, setTests] = useState([]);
    const { state } = useLocation();
    const { moduleId, moduleTitle } = state;

    useEffect(() => {
        async function initTests(){
            const recTest = await getTests(moduleId);
            setTests(recTest)
        }
        initTests();
    }, [moduleId, setTests])

  return (
    <Layout>
        <div className="mb-5">
        <h1>Модуль "{moduleTitle}"</h1>
        </div>

        <h3 className="mb-3">Тесты:</h3>
        <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
            {tests.length === 0 && (
                <div>Нет тестов</div>
            )}
            {tests.map((test) => (
                <TestCard
                key={test.id}
                id={test.id}
                moduleId={moduleId}
                title={test.name}
                canDelete={false}
                isStudent={true}
                />
            ))}
        </div>
    </Layout>
  );
};

export default UserModulePage;