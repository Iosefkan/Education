import AccordionMultiSelect from "../../components/AccordionMutiSelect";
import Layout from "../../components/Layout";
import { Alert, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPractAllQuestion, updatePractQuestions } from "../../services/teacher.service";

const MakeTestPage = () => {
    const { state } = useLocation();
    const { practId, practTitle, moduleId } = state;
    const [selectedIds, setSelectedIds] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [saveMessage, setSaveMessage] = useState({});

    useEffect(() => {
        async function InitQuestions(){
            let recQuestions = await getPractAllQuestion(moduleId, practId);
            recQuestions = recQuestions.map(q => { return {...q, body: JSON.parse(q.body)} })
            setQuestions(recQuestions)
        }
        InitQuestions();
    }, [moduleId, practId, setQuestions])

    const handleUpdateTestQuestions = async () => {
        const result = await updatePractQuestions(practId, selectedIds);
        if (result){
            setSaveMessage({ isError: false, message: 'Вопросы в тесте обновлены'})
        }
        else {
            setSaveMessage({ isError: true, message: 'Ошибка при обновлении вопросов теста'})
        }

        setTimeout(() => setSaveMessage({}), 5000);
    }

    return (
        <Layout>
            <div className="mb-5">
                <h1>Практический материал "{practTitle}"</h1>
            </div>
            {saveMessage.message && (
            <Alert variant={saveMessage.isError ? "danger" : "success"} className="mt-3">
              {saveMessage.message}
            </Alert>
            )}
            <Button className="mb-3" onClick={() => handleUpdateTestQuestions()}>
                Сохранить изменения
            </Button>
            <AccordionMultiSelect className="mb-10"
                options={questions}
                onSelectionChange={(selected) => setSelectedIds(selected)}
            />
        </Layout>
    )
}

export default MakeTestPage;