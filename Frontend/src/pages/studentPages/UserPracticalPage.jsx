import Layout from "../../components/Layout";
import TaskCard from "../../components/cards/TaskCard";
import { Button, Alert, Tab, Container, Col, Row, Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getPracticalQuestions,
  getTestResult,
} from "../../services/student.service";
import { getTasks } from "../../services/shared.service";
import PaginatedData from "../../components/PaginatedData";
import BaseQuestion from "../../components/questions/BaseQuestion";
import BaseAnswer from "../../components/questionAnswers/BaseAnswer";

const UserPracticalPage = () => {
  const { state } = useLocation();
  const { practId, practTitle } = state;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isResult, setIsResult] = useState(false);
  const [result, setResult] = useState({});
  const [activeKey, setActiveKey] = useState("tasks");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function InitQuestions() {
      let recQuestions = await getPracticalQuestions(practId);
      recQuestions = recQuestions.map((q) => {
        return { ...q, body: JSON.parse(q.body) };
      });
      setQuestions(recQuestions);
      setIsQuestionsLoading(false);
      setAnswers(
        recQuestions.map((q) => {
          return { id: q.id };
        })
      );
    }
    InitQuestions();
  }, [practId, setQuestions, setAnswers]);

  useEffect(() => {
    async function InitTasks() {
      let rec = await getTasks(practId);
      setTasks(rec);
    }
    InitTasks();
  }, [practId, setTasks]);

  const validate = () => {
    let newErrors = "";
    if (answers.some((answ) => Object.keys(answ).length === 1))
      newErrors = "Заполните ответы на все вопросы";

    setError(newErrors);
    return !newErrors;
  };

  const checkResult = async () => {
    if (!validate()) return;
    const testResult = await getTestResult(answers);
    setResult(testResult);
    setIsResult(true);
  };

  return (
    <Layout>
      <Container fluid className="mt-5">
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="tasks">Задания</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="test">Составление теста</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="tasks">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>

                  <h3 className="mb-3">Задания:</h3>
                  <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                    {tasks.length === 0 && <div>Нет заданий</div>}
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.name}
                        canDelete={false}
                        isStudent={true}
                      />
                    ))}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="test">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}
                  {isResult && (
                    <h3>
                      <br />
                      Оценка за тест: {result.grade}
                      <br />
                      Выполнено: {result.score}, {result.percent}
                    </h3>
                  )}
                  {!isResult && (
                    <Button
                      className="w-100 mb-5"
                      style={{ height: "65px" }}
                      onClick={checkResult}
                    >
                      Проверить результат
                    </Button>
                  )}

                  {!isResult && (
                    <PaginatedData
                      isLoading={isQuestionsLoading}
                      length={questions.length}
                      data={questions}
                      pageSizeOptions={[5, 10, 15]}
                    >
                      <BaseQuestion setAnswers={setAnswers} answers={answers} />
                    </PaginatedData>
                  )}
                  {isResult && (
                    <PaginatedData
                      length={result.answers.length}
                      data={result.answers}
                      pageSizeOptions={[5, 10, 15]}
                    >
                      <BaseAnswer />
                    </PaginatedData>
                  )}

                  {error && (
                    <Alert variant="danger" className="mt-5">
                      {error}
                    </Alert>
                  )}
                  {!isResult && (
                    <Button
                      className="w-100 my-5"
                      style={{ height: "65px" }}
                      onClick={checkResult}
                    >
                      Проверить результат
                    </Button>
                  )}
                  {isResult && (
                    <div className="mb-5"></div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
};

export default UserPracticalPage;
