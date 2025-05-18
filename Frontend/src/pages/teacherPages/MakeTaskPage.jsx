import { useState, useEffect } from "react";
import {
  Accordion,
  Button,
  Card,
  Alert,
  Form,
  ListGroup,
} from "react-bootstrap";
import { FileWord, BodyText } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import RichTextEditor from "../../components/RichTextEditor";
import {
  getTaskFiles,
  updateTaskText,
  createComment,
  setAccepted,
} from "../../services/teacher.service";
import { getTaskText } from "../../services/shared.service";
import Layout from "../../components/Layout";
import FileWithComments from "../../components/FileWithComments";
import {
  getModuleCrumbs,
  getCourseCrumbs,
  getPractCrumbs,
} from "../../services/crumbsHelper";

const MakeTheoryMaterialPage = () => {
  const { state } = useLocation();
  const { taskId, taskTitle } = state;
  const courseCrumbs = getCourseCrumbs();
  const moduleCrumbs = getModuleCrumbs();
  const practCrumbs = getPractCrumbs();
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
      active: false,
      to: "/makeTest",
      id: 4,
      state: practCrumbs,
      label: `Практический материал "${practCrumbs.practTitle}"`,
    },
    {
      active: true,
      to: "/makeTask",
      id: 5,
      state: state,
      label: `Задание "${taskTitle}"`,
    },
  ];

  const [taskFiles, setTaskFiles] = useState([]);

  const [content, setContent] = useState("");
  const [saveMessage, setSaveMessage] = useState({});

  useEffect(() => {
    async function initTaskFiles() {
      const rec = await getTaskFiles(taskId);
      setTaskFiles(rec);
    }
    initTaskFiles();
  }, [taskId, setTaskFiles]);

  useEffect(() => {
    async function initText() {
      const recText = await getTaskText(taskId);
      setContent(recText);
    }
    initText();
  }, [taskId, setContent]);

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

  const handleUpdateText = async () => {
    const result = await updateTaskText(taskId, content);
    if (!result) {
      setSaveMessage({
        isError: true,
        message: "Ошибка при обновлении задания",
      });
    } else {
      setSaveMessage({ isError: false, message: "Задание успешно обновлена" });
    }

    setTimeout(() => setSaveMessage({}), 5000);
  };

  const handleAcceptTaskFile = async (taskFileId) => {
    await setAccepted(taskFileId);
    setTaskFiles(
      taskFiles.map((file) =>
        file.id === taskFileId ? { ...file, isAccepted: true } : file
      )
    );
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

  return (
    <Layout paths={paths}>
      <Card className="shadow-lg">
        <Card.Header className="bg-light">
          <h2>{taskTitle}</h2>
        </Card.Header>

        <Card.Body>
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <BodyText className="me-2" /> Текст задания
              </Accordion.Header>
              <Accordion.Body>
                {saveMessage.message && (
                  <Alert
                    variant={saveMessage.isError ? "danger" : "success"}
                    className="mt-3"
                  >
                    {saveMessage.message}
                  </Alert>
                )}
                <Button className="mb-3" onClick={() => handleUpdateText()}>
                  Сохранить текст задания
                </Button>
                <RichTextEditor
                  value={content}
                  onChange={(value) => setContent(value)}
                  placeholder="Текст задания..."
                />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <FileWord className="me-2" /> Выполненные задания (
                {filteredFiles.length})
              </Accordion.Header>
              <Accordion.Body>
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
                      onAccept={() => handleAcceptTaskFile(file.id)}
                    />
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default MakeTheoryMaterialPage;
