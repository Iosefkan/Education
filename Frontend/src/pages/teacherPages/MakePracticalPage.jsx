import AccordionMultiSelect from "../../components/AccordionMutiSelect";
import Layout from "../../components/Layout";
import TaskCard from "../../components/cards/TaskCard";
import CreateTaskModal from "../../components/sidebars/CreateTaskModal";
import {
  Alert,
  Button,
  Tab,
  Nav,
  Container,
  Row,
  Col,
  ListGroup,
  Card,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getPractAllQuestion,
  updatePractQuestions,
  createTask,
  deleteTask,
  setPublic,
  getTasks,
  getUserProtocols,
} from "../../services/teacher.service";
import getGrade from "../../services/gradingHelper";

const MakePracticalPage = () => {
  const { state } = useLocation();
  const { practId, practTitle, moduleId } = state;
  const [selectedIds, setSelectedIds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [userProtocols, setUserProtocols] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState({});
  const [activeKey, setActiveKey] = useState("tasks");
  const navigate = useNavigate();

  useEffect(() => {
    async function InitQuestions() {
      let recQuestions = await getPractAllQuestion(moduleId, practId);
      setIsPublic(recQuestions.isPublic);
      recQuestions = recQuestions.questions.map((q) => {
        return { ...q, body: JSON.parse(q.body) };
      });
      setQuestions(recQuestions);
    }
    InitQuestions();
  }, [moduleId, practId, setQuestions, setIsPublic]);

  useEffect(() => {
    async function InitTasks() {
      let rec = await getTasks(practId);
      setTasks(rec);
    }
    InitTasks();
  }, [practId, setTasks]);

  useEffect(() => {
    async function InitProtocols() {
      if (!isPublic) return;
      const rec = await getUserProtocols(practId);
      setUserProtocols(rec);
    }
    InitProtocols();
  }, [isPublic, practId, setUserProtocols]);

  const handleUpdateTestQuestions = async () => {
    const result = await updatePractQuestions(practId, selectedIds);
    if (result) {
      setSaveMessage({ isError: false, message: "Вопросы в тесте обновлены" });
    } else {
      setSaveMessage({
        isError: true,
        message: "Ошибка при обновлении вопросов теста",
      });
    }

    setTimeout(() => setSaveMessage({}), 5000);
  };

  const handleCreateTask = async (taskData) => {
    const newTask = await createTask(practId, taskData.name);
    setTasks([...tasks, newTask]);
  };

  const handleSetPublic = async () => {
    handleUpdateTestQuestions();
    await setPublic(practId);
    setIsPublic(true);
  };

  const handleDeleteTask = async (taskData) => {
    await deleteTask(taskData.id);
    setTasks(tasks.filter((m) => m.id !== taskData.id));
  };

  const handleSelectProtocol = (userId, username) => {
    navigate("/testProtocol", {
      state: { userId, username, practName: practTitle, practId },
    });
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
                {isPublic && (
                  <Nav.Item>
                    <Nav.Link eventKey="protocol">
                      Протоколы тестирования
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="tasks">
                  <div className="mb-5 d-flex flex-row align-items-center gap-5">
                    <h1>Практический материал "{practTitle}"</h1>
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowTaskModal(true)}
                    >
                      Добавить задание
                    </Button>
                  </div>

                  <h3 className="mb-3">Созданные задания:</h3>
                  <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                    {tasks.length === 0 && <div>Нет заданий</div>}
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.name}
                        canDelete={true}
                        onDelete={() => handleDeleteTask(task)}
                      />
                    ))}
                  </div>

                  <CreateTaskModal
                    show={showTaskModal}
                    onHide={() => setShowTaskModal(false)}
                    onCreate={(courseData) => handleCreateTask(courseData)}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="test">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>
                  {saveMessage.message && (
                    <Alert
                      variant={saveMessage.isError ? "danger" : "success"}
                      className="mt-3"
                    >
                      {saveMessage.message}
                    </Alert>
                  )}
                  {!isPublic && (
                    <div className="d-flex justify-content-start mb-3 gap-3">
                      <Button onClick={() => handleUpdateTestQuestions()}>
                        Сохранить изменения
                      </Button>
                      <Button onClick={() => handleSetPublic()}>
                        Сохранить изменения и завершить
                      </Button>
                    </div>
                  )}
                  {isPublic && (
                    <h5 className="mb-3">Создание теста завершено</h5>
                  )}

                  <AccordionMultiSelect
                    className="mb-10"
                    isReadonly={isPublic}
                    options={questions}
                    onSelectionChange={(selected) => setSelectedIds(selected)}
                  />
                </Tab.Pane>
                {isPublic && (
                  <Tab.Pane eventKey="protocol">
                    <ListGroup>
                      {userProtocols.map((prot) => (
                        <Card
                          key={prot.id}
                          className="hover-overlay"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleSelectProtocol(prot.userId, prot.name)
                          }
                        >
                          <Card.Header className="mb-0">
                            <Card.Title>
                              Выполнивший студент: {prot.name}
                            </Card.Title>
                          </Card.Header>
                          <Card.Body>
                            Оценка за тест:{" "}
                            {getGrade(prot.score, prot.maxScore)}
                            <br />
                            Выполнено: {prot.score.toFixed(2)}/
                            {prot.maxScore.toFixed(2)},{" "}
                            {((prot.score / prot.maxScore) * 100).toFixed(2)}%
                          </Card.Body>
                        </Card>
                      ))}
                      {!userProtocols ||
                        (userProtocols.length === 0 && (
                          <h5>Нет выполневший тест стедентов</h5>
                        ))}
                    </ListGroup>
                  </Tab.Pane>
                )}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
};

export default MakePracticalPage;
