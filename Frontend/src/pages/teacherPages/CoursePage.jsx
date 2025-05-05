import Layout from "../../components/Layout";
import ModuleCard from "../../components/cards/ModuleCard";
import CreateModuleModal from "../../components/sidebars/CreateModuleModal";
import MultiSelectSearch from "../../components/MultiSelectSearch";
import { useState, useEffect } from "react";
import { deleteModule, createModule, getUsers, saveUsers } from "../../services/teacher.service";
import { getModules } from "../../services/shared.service";
import { Button, Tab, Nav, Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const CoursePage = () => {
  const [activeKey, setActiveKey] = useState('modules');
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [saveMessage, setSaveMessage] = useState({});
  const [users, setUsers] = useState([]);
  const { state } = useLocation();
  const { courseId, courseTitle } = state;

  useEffect(() => {
      async function initModules(){
          const recModules = await getModules(courseId);
          setModules(recModules)
      }
      initModules();
  }, [courseId, setModules])

  useEffect(() => {
    async function initUsers(){
        const recUsers = await getUsers(courseId);
        setUsers(recUsers);
        const firstSelected = recUsers.filter(u => u.isEnrolled).map(u => u.value);
        setSelectedUsers(firstSelected);
    }
    initUsers();
}, [courseId, setSelectedUsers, setUsers])

  const handleCreate = async (moduleData) => {
    const newCourse = await createModule(courseId, moduleData.name);
    setModules([...modules, newCourse])
  }

  const handleDelete = async (module) => {
    await deleteModule(module.id);
    setModules(modules.filter(m => m.id !== module.id))
  }

  const handleSaveEnrolledUsers = async () => {
    const result = await saveUsers(courseId, selectedUsers);
    if (result){
      setSaveMessage({ isError: false, message: 'Записанные студенты обновлены'})
    }
    else {
      setSaveMessage({ isError: true, message: 'Ошибка при обновлении записанных студентов'})
    }

    setTimeout(() => setSaveMessage({}), 5000);
  }


  return (
    <Layout>
      <Container fluid className="mt-5">
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="modules">Модули</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users">Записанные студенты</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="modules">
                  <div className="mb-5 d-flex flex-row align-items-center gap-5">
                    <h1>Курс "{courseTitle}"</h1>
                    <Button variant="outline-primary" onClick={() => setShowModal(true)}>
                        Добавить раздел
                    </Button>
                  </div>

                  <h3 className="mb-3">Созданные разделы:</h3>
                  <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                    {modules.length === 0 && (
                        <div>Нет разделов</div>
                    )}
                    {modules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        id={module.id}
                        title={module.name}
                        canDelete={true}
                        onDelete={() => handleDelete(module)}
                        />
                    ))}
                  </div>

                  <CreateModuleModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    onCreate={(courseData) => handleCreate(courseData)}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="users">
                  {saveMessage.message && (
                    <Alert variant={saveMessage.isError ? "danger" : "success"} className="mt-3">
                      {saveMessage.message}
                    </Alert>
                  )}
                  <Button className="mb-3" onClick={() => handleSaveEnrolledUsers()}>
                    Сохранить изменения
                  </Button>
                  <MultiSelectSearch className="mb-10"
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

export default CoursePage;