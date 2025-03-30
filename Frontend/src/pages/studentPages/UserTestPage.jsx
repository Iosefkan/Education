import SingleChoiceQuestion from "../..//components/questions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../..//components/questions/MultipleChoiceQuestion";
import MatchingQuestion from "../..//components/questions/MatchingQuestion";
import ShortAnswerQuestion from "../..//components/questions/ShortAnswerQuestion";
import Layout from "../../components/Layout";
import { Button, Alert, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPracticalQuestions, getTestResult } from "../../services/student.service";

const UserTestPage = () => {
    const { state } = useLocation();
    const { practId, practTitle } = state;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState('');
    const [showResultModal, setShowResultModal] = useState(false);
    const [result, setResult] = useState({ grade: 2, percent: 20});

    useEffect(() => {
        async function InitQuestions(){
            let recQuestions = await getPracticalQuestions(practId);
            recQuestions = recQuestions.map(q => { return {...q, body: JSON.parse(q.body)} });
            setQuestions(recQuestions);
            setAnswers(recQuestions.map(q => { return { id: q.id }}));
        }
        InitQuestions();
    }, [practId, setQuestions, setAnswers])

    const validate = () => {
        let newErrors = '';
        if (answers.some(answ => Object.keys(answ).length === 1)) newErrors = 'Заполните ответы на все вопросы';
        
        setError(newErrors);
        return !newErrors;
    };

    const checkResult = async () => {
        if (!validate()) return;
        const testResult = await getTestResult(answers);
        setResult(testResult);
        setShowResultModal(true);
    }

    return (
        <Layout>
            <div className="mb-5">
                <h1>Практический материал "{practTitle}"</h1>
            </div>

            {error && (
            <Alert variant="danger" className="mb-3">
                {error}
            </Alert>
            )}
            <Button className="w-100 mb-5" style={{height: '65px'}} onClick={checkResult}>
                Проверить результат
            </Button>

            {questions.map(option => (
                option.type == 1 ? 
                  (<SingleChoiceQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  options={option.body.options}
                  isReadonly={false}
                  onSelect={(ans) => setAnswers(answers.map(a => a.id === option.id ? { ...a, answer: ans } : a))}
                  />)
                  : option.type == 2 ? 
                  (<MultipleChoiceQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  options={option.body.options}
                  isReadonly={false}
                  onSelect={(ans) => setAnswers(answers.map(a => a.id === option.id ? { ...a, answer: JSON.stringify(ans) } : a))}
                  />)
                  : option.type == 3 ? 
                  (<MatchingQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  leftItems={option.body.leftItems}
                  rightItems={option.body.rightItems}
                  isReadonly={false}
                  onMatch={(ans) => setAnswers(answers.map(a => a.id === option.id ? { ...a, answer: JSON.stringify(ans) } : a))}
                  />)
                  : option.type == 4 ? 
                  (<ShortAnswerQuestion
                  key={option.id}
                  questionId={option.id}
                  questionText={option.text}
                  isReadonly={false}
                  onSave={(ans) => setAnswers(answers.map(a => a.id === option.id ? { ...a, answer: ans } : a))}
                  />) : (<></>)))}

            {error && (
                <Alert variant="danger" className="mt-5">
                    {error}
                </Alert>
            )}
            <Button className={error ? 'w-100' : "w-100 mt-5"}  style={{height: '65px'}} onClick={checkResult}>
                Проверить результат
            </Button>

            <Modal show={showResultModal} onHide={() => setShowResultModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Результат теста</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы - большой молодец!!!<br/>
                    Ваша оценка за тест - {result.grade}<br/>
                    Выполнено {result.score}, {result.percent}
                </Modal.Body>
            </Modal>
        </Layout>
    )
}

export default UserTestPage;