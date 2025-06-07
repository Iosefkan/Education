import AccordionMultiSelect from "../../components/AccordionMutiSelect";
import Layout from "../../components/Layout";
import TaskCard from "../../components/cards/TaskCard";
import CreateTaskModal from "../../components/sidebars/CreateTaskModal";
import FileWithComments from "../../components/FileWithComments";
import {
  Alert,
  Button,
  Tab,
  Nav,
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getPractAllQuestion,
  updatePractQuestions,
  createTask,
  deleteTask,
  setPublic,
  getTasks,
  getUserProtocols,
  getPracticalTaskFiles,
  createComment,
  setAccepted,
  getPracticalUsers,
  savePracticalUsers
} from "../../services/teacher.service";
import {
  getModuleCrumbs,
  getCourseCrumbs,
  setPractCrumbs,
} from "../../services/crumbsHelper";
import "../../css/numInput.css";
import MultiSelectSearch from "../../components/MultiSelectSearch";
import UserProtocols from "../../components/UserProtocols";

const MakePracticalPage = () => {
  const { state } = useLocation();
  const { practId, practTitle, moduleId } = state;
  setPractCrumbs(state);
  const courseCrumbs = getCourseCrumbs();
  const moduleCrumbs = getModuleCrumbs();
  const paths = [
    {
      active: false,
      to: "/courses",
      id: 1,
      state: {},
      label: "Курсы",
    },
    {
      active: false,
      to: "/course",
      id: 2,
      state: courseCrumbs,
      label: `Курс "${courseCrumbs.courseTitle}"`,
    },
    {
      active: false,
      to: "/module",
      id: 3,
      state: moduleCrumbs,
      label: `Раздел "${moduleCrumbs.moduleTitle}"`,
    },
    {
      active: true,
      to: "/makeTest",
      id: 4,
      state: state,
      label: `Практический материал "${practTitle}"`,
    },
  ];
  const [taskFiles, setTaskFiles] = useState([]);

  useEffect(() => {
    async function initTaskFiles() {
      const rec = await getPracticalTaskFiles(practId);
      setTaskFiles(rec);
    }
    initTaskFiles();
  }, [practId, setTaskFiles]);

  const handleAddComment = async (taskFileId, comment) => {
    const result = await createComment(taskFileId, comment);
    setTaskFiles(
      taskFiles.map((file) => {
        if (file.id === taskFileId) {
          file.comments.push(result);
          file.isUpdated = false;
        }
        return file;
      })
    );
  };

  const handleAcceptTaskFile = async (taskFileId, grade) => {
    await setAccepted(taskFileId, grade);
    setTaskFiles(
      taskFiles.map((file) =>
        file.id === taskFileId ? { ...file, isAccepted: true, grade: grade } : file
      )
    );
  };

  const [selectedIds, setSelectedIds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [userProtocols, setUserProtocols] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState({});
  const [activeKey, setActiveKey] = useState("tasks");
  const [triesCount, setTriesCount] = useState(1);
  const [percentForFive, setPercentForFive] = useState(90);
  const [percentForFour, setPercentForFour] = useState(75);
  const [percentForThree, setPercentForThree] = useState(60);

  useEffect(() => {
    async function InitQuestions() {
      let recQuestions = await getPractAllQuestion(moduleId, practId);
      setIsPublic(recQuestions.isPublic);
      setTriesCount(recQuestions.triesCount);
      setPercentForFive(recQuestions.percentForFive);
      setPercentForFour(recQuestions.percentForFour);
      setPercentForThree(recQuestions.percentForThree);
      recQuestions = recQuestions.questions.map((q) => {
        return { ...q, body: JSON.parse(q.body) };
      });
      setQuestions(recQuestions);
    }
    InitQuestions();
  }, [moduleId, practId, setQuestions, setIsPublic, setTriesCount]);

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
    const result = await updatePractQuestions(practId, selectedIds, triesCount, percentForFive, percentForFour, percentForThree);
    if (result) {
      setSaveMessage({ isError: false, message: "Тест обновлен" });
    } else {
      setSaveMessage({
        isError: true,
        message: "Ошибка при обновлении теста",
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

  const validateTriesCount = (e) => {
    e.target.value = Math.trunc(e.target.value);
    if (e.target.value < 1) {
      e.target.value = 1;
    }
    if (e.target.value > 10) {
      e.target.value = 10;
    }
  };

  const validatePercent = (e) => {
    e.target.value = Number(e.target.value);
    if (e.target.value < 0) {
      e.target.value = 0;
    }
    if (e.target.value > 100) {
      e.target.value = 100;
    }
  };

  const [selectedFilterType, setSelectedFilterType] = useState("0");
  const filters = ["Все загрузки", "Принятые", "Обновленные"];
  const handleFilterTypeChange = (event) => {
    setSelectedFilterType(event.target.value);
  };
  const filteredFiles =
    selectedFilterType === "0"
      ? taskFiles
      : selectedFilterType === "1"
      ? taskFiles.filter((tf) => tf.isAccepted)
      : taskFiles.filter((tf) => tf.isUpdated && !tf.isAccepted);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  useEffect(() => {
    async function initUsers() {
      const recUsers = await getPracticalUsers(practId);
      setUsers(recUsers);
      const firstSelected = recUsers
        .filter((u) => u.isEnrolled)
        .map((u) => u.value);
      setSelectedUsers(firstSelected);
    }
    initUsers();
  }, [practId, setSelectedUsers, setUsers]);
  
  const handleSaveEnrolledUsers = async () => {
    const result = await savePracticalUsers(practId, selectedUsers);
    if (result) {
      setSaveMessage({
        isError: false,
        message: "Записанные студенты обновлены",
      });
    } else {
      setSaveMessage({
        isError: true,
        message: "Ошибка при обновлении записанных студентов",
      });
    }

    setTimeout(() => setSaveMessage({}), 5000);
  };

  return (
    <Layout paths={paths}>
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
                      Результаты студентов
                    </Nav.Link>
                  </Nav.Item>
                )}
                <Nav.Item>
                  <Nav.Link eventKey="taskUploads">
                    Выполненные задания
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users">Записанные студенты</Nav.Link>
                </Nav.Item>
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
                        Сохранить изменения и завершить редактирование
                      </Button>
                    </div>
                  )}
                  {isPublic && (
                    <h5 className="mb-3">Создание теста завершено</h5>
                  )}

                  <FloatingLabel
                    controlId="title"
                    label="Количество попыток"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      size="lg"
                      className="no-spinners"
                      readOnly={isPublic}
                      value={triesCount}
                      onChange={(e) => {
                        validateTriesCount(e);
                        setTriesCount(e.target.value);
                      }}
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="five"
                    label="Процент выполнения на оценку 5"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      size="lg"
                      className="no-spinners"
                      readOnly={isPublic}
                      value={percentForFive}
                      onChange={(e) => {
                        validatePercent(e);
                        setPercentForFive(e.target.value);
                      }}
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="four"
                    label="Процент выполнения на оценку 4"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      size="lg"
                      className="no-spinners"
                      readOnly={isPublic}
                      value={percentForFour}
                      onChange={(e) => {
                        validatePercent(e);
                        setPercentForFour(e.target.value);
                      }}
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="three"
                    label="Процент выполнения на оценку 3"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      size="lg"
                      className="no-spinners"
                      readOnly={isPublic}
                      value={percentForThree}
                      onChange={(e) => {
                        validatePercent(e);
                        setPercentForThree(e.target.value);
                      }}
                    />
                  </FloatingLabel>

                  <AccordionMultiSelect
                    className="mb-10"
                    isReadonly={isPublic}
                    options={questions}
                    onSelectionChange={(selected) => setSelectedIds(selected)}
                  />
                </Tab.Pane>
                {isPublic && (
                  <Tab.Pane eventKey="protocol">
                    <div className="mb-5">
                      <h1>Практический материал "{practTitle}"</h1>
                    </div>
                    <ListGroup>
                      {userProtocols.map((prot) => (
                        <UserProtocols
                          key={prot.userId}
                          practTitle={practTitle}
                          userProtocol={prot}
                        />
                      ))}
                      {!userProtocols ||
                        (userProtocols.length === 0 && (
                          <h5>Нет выполнивших тест студентов</h5>
                        ))}
                    </ListGroup>
                  </Tab.Pane>
                )}
                <Tab.Pane eventKey="taskUploads">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>
                  <h3 className="mb-3">
                    Выполненные задания ({filteredFiles.length})
                  </h3>
                  <Form.Group className="mb-3">
                    <Form.Label>Фильтрация заданий</Form.Label>
                    <Form.Select
                      value={selectedFilterType}
                      onChange={handleFilterTypeChange}
                      aria-label="Type selection dropdown"
                    >
                      <option value="0">{filters[0]}</option>
                      <option value="1">{filters[1]}</option>
                      <option value="2">{filters[2]}</option>
                    </Form.Select>
                  </Form.Group>
                  <ListGroup>
                    {filteredFiles.map((file) => (
                      <FileWithComments
                        key={file.id}
                        file={file}
                        onAddComment={handleAddComment}
                        onAccept={(grade) => handleAcceptTaskFile(file.id, grade)}
                      />
                    ))}
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="users">
                  {saveMessage.message && (
                    <Alert
                      variant={saveMessage.isError ? "danger" : "success"}
                      className="mt-3"
                    >
                      {saveMessage.message}
                    </Alert>
                  )}
                  <Button
                    className="mb-3"
                    onClick={() => handleSaveEnrolledUsers()}
                  >
                    Сохранить изменения
                  </Button>
                  <MultiSelectSearch
                    className="mb-10"
                    options={users}
                    onSelectionChange={(selected) => setSelectedUsers(selected)}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
};

export default MakePracticalPage;
