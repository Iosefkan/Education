import Layout from "../../components/Layout";
import TaskCard from "../../components/cards/TaskCard";
import {
  Button,
  Alert,
  Tab,
  Container,
  Col,
  Row,
  Nav,
  ListGroup,
  Card,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getPracticalQuestions,
  getTestResult,
  getTasks,
  getTestStatus,
  startTest,
  getProtocols,
  getGrade
} from "../../services/student.service";
import PaginatedData from "../../components/PaginatedData";
import BaseQuestion from "../../components/questions/BaseQuestion";
import {
  getModuleCrumbs,
  getCourseCrumbs,
  setPractCrumbs,
} from "../../services/crumbsHelper";

const UserPracticalPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { practId, practTitle } = state;
  setPractCrumbs(state);
  const courseCrumbs = getCourseCrumbs();
  const moduleCrumbs = getModuleCrumbs();
  const paths = [
    {
      active: false,
      to: "/userCourses",
      id: 1,
      state: {},
      label: "Курсы",
    },
    {
      active: false,
      to: "/userCourse",
      id: 2,
      state: courseCrumbs,
      label: `Курс "${courseCrumbs.courseTitle}"`,
    },
    {
      active: false,
      to: "/userModule",
      id: 3,
      state: moduleCrumbs,
      label: `Раздел "${moduleCrumbs.moduleTitle}"`,
    },
    {
      active: true,
      to: "/test",
      id: 4,
      state: state,
      label: `Практический материал "${practTitle}"`,
    },
  ];

  const [questions, setQuestions] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [tryNumber, setTryNumber] = useState(1);
  const [protocols, setProtocols] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [activeKey, setActiveKey] = useState("grade");
  const [tasks, setTasks] = useState([]);
  const [totalGrade, setTotalGrade] = useState({ messages: ['загрузка...']});

  useEffect(() => {
    async function initTotalGrade() {
      let resp = await getGrade(practId);
      setTotalGrade(resp);
    }
    initTotalGrade();
  }, [practId, setTotalGrade])

  useEffect(() => {
    async function InitQuestions() {
      let resp = await getTestStatus(practId);
      setIsStarted(resp.isStarted);
      setTryNumber(resp.tryNumber);
      if (!resp.isStarted) {
        return;
      }
      let rec = await getPracticalQuestions(practId);
      rec = rec.questions.map((q) => {
        return { ...q, body: JSON.parse(q.body) };
      });
      setQuestions(rec);
      setAnswers(
        rec.map((q) => {
          return { id: q.id };
        })
      );
      setIsQuestionsLoading(false);
    }
    InitQuestions();
  }, [practId, setQuestions, setIsQuestionsLoading, setAnswers, setIsStarted]);

  useEffect(() => {
    async function InitProtocols() {
      let rec = await getProtocols(practId);
      setProtocols(rec);
    }
    InitProtocols();
  }, [practId, setProtocols]);

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
    const testProtocol = await getTestResult(answers, practId);
    setProtocols([...protocols, testProtocol]);
    setResultMessage('Результаты теста успешно загружены, посмотреть результат можно во вкладке протоколов');
    setIsStarted(false);

    setTimeout(() => setResultMessage(""), 5000);
  };

  const handleStartTest = async () => {
    try {
      const tryNumber = await startTest(practId);
      setTryNumber(tryNumber);
    } catch {
      setError({ message: "Достигнуто максимальное количество попыток сдачи" });
    }

    let rec = await getPracticalQuestions(practId);
    rec = rec.questions.map((q) => {
      return { ...q, body: JSON.parse(q.body) };
    });
    setQuestions(rec);
    setAnswers(
      rec.map((q) => {
        return { id: q.id };
      })
    );
    setIsQuestionsLoading(false);
    setIsStarted(true);
  };

  const handleSelectProtocol = (testResultId, userId, tryNumber) => {
    navigate("/userProtocol", {
      state: {
        testResultId,
        practName: practTitle,
        tryNumber: tryNumber,
      },
    });
  };

  return (
    <Layout paths={paths}>
      <Container fluid className="mt-5">
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="grade">Оценка</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tasks">Задания</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="test">Тест</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="protocols">
                    Протоколы попыток сдачи
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="grade">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>

                  {!totalGrade.messages && (
                    <h3>Итоговая оценка за тест и задания: {totalGrade.grade}</h3>
                  )}
                  {totalGrade.messages && (
                    <>
                      <h3>Для получения итоговой оценки:</h3>
                      <ul>
                        {totalGrade.messages.map((mes, ind) => (
                          <li key={ind}><h5>{mes}</h5></li>
                        ))}
                      </ul>
                    </>
                  )}
                </Tab.Pane>
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
                        isAccepted={task.isAccepted}
                        isUpdated={task.isUpdated}
                        canDelete={false}
                        isStudent={true}
                        grade={task.grade}
                      />
                    ))}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="test">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>
                  {!isStarted && (
                    <>
                      {error.message && (
                        <Alert variant="danger" className="mt-3">
                          {error.message}
                        </Alert>
                      )}
                      {resultMessage && (
                        <Alert variant="success" className="mt-3">
                          {resultMessage}
                        </Alert>
                      )}
                      <Button
                        className="w-100 mb-5"
                        style={{ height: "65px" }}
                        onClick={handleStartTest}
                      >
                        Начать тест
                      </Button>
                    </>
                  )}
                  {isStarted && (
                    <h5 className="mb-3">Попытка сдачи №{tryNumber}</h5>
                  )}

                  {isStarted && (
                    <>
                      {error && (
                        <Alert variant="danger" className="mb-3">
                          {error}
                        </Alert>
                      )}
                      <Button
                        className="w-100 mb-5"
                        style={{ height: "65px" }}
                        onClick={checkResult}
                      >
                        Сдать тест
                      </Button>

                      <PaginatedData
                        isLoading={isQuestionsLoading}
                        length={questions.length}
                        data={questions}
                        pageSizeOptions={[5, 10, 15]}
                      >
                        <BaseQuestion
                          setAnswers={setAnswers}
                          answers={answers}
                        />
                      </PaginatedData>

                      {error && (
                        <Alert variant="danger" className="mt-5">
                          {error}
                        </Alert>
                      )}
                      <Button
                        className="w-100 my-5"
                        style={{ height: "65px" }}
                        onClick={checkResult}
                      >
                        Сдать тест
                      </Button>
                    </>
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="protocols">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>

                  {protocols.length === 0 && (
                    <h5>Нет сохраненных попыток сдачи</h5>
                  )}
                  <ListGroup>
                    {protocols.map((prot) => (
                      <Card
                        key={prot.id}
                        className="hover-overlay mb-3"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleSelectProtocol(prot.id, prot.userId, prot.tryNumber)
                        }
                      >
                        <Card.Header className="mb-0">
                          <Card.Title>Попытка №{prot.tryNumber}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          Оценка за тест: {prot.grade}
                          <br />
                          Выполнено: {prot.score.toFixed(2)}/
                          {prot.maxScore.toFixed(2)},{" "}
                          {((prot.score / prot.maxScore) * 100).toFixed(2)}%
                        </Card.Body>
                      </Card>
                    ))}
                  </ListGroup>
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
