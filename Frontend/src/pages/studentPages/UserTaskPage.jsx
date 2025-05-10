import { useState, useEffect } from "react";
import {
  Button,
  Alert,
  Form,
  Accordion,
  Card,
  Stack,
  ListGroup,
} from "react-bootstrap";
import { Upload, Trash, FileEarmarkWord } from "react-bootstrap-icons";
import { getTaskText } from "../../services/shared.service";
import { getTaskFile, uploadTaskFile } from "../../services/student.service";
import Layout from "../../components/Layout";
import ReadOnlyRichText from "../../components/ReadOnlyRichText";
import { useLocation } from "react-router-dom";
import MessageBubble from "../../components/MessageBubble";

const BorderlessAccordion = () => {
  const [content, setContent] = useState("");
  const { state } = useLocation();
  const { taskId, taskTitle } = state;

  useEffect(() => {
    async function initText() {
      const recText = await getTaskText(taskId);
      setContent(recText);
    }
    initText();
  }, [taskId, setContent]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initTaskFile() {
      const rec = await getTaskFile(taskId);
      setTask(rec);
      setComments(rec.comments);
    }
    initTaskFile();
  }, [taskId, setContent, setComments]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setError("Выберите .docx файл");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    try {
      const taskFile = await uploadTaskFile(taskId, selectedFile);
      setTask(taskFile);
      setSelectedFile(null);
      setError(null);
    } catch {
      setError("Во время загрузки произошла ошибка");
    }
  };

  const handleDelete = async () => {
    setSelectedFile(null);
    setTask(null);
    setError(null);
  };

  return (
    <Layout>
      <Card className="shadow-lg">
        <Card.Header className="bg-light">
          <h2>
            {taskTitle}
            {task?.isAccepted && (
              <span className="text-primary"> (выполнено)</span>
            )}
          </h2>
        </Card.Header>

        <Card.Body>
          <Accordion defaultActiveKey={[]} className="mb-5">
            <style>
              {`.accordion-button:not(.collapsed) {
                background-color: transparent !important;
                box-shadow: none !important;
                }
                .accordion-button:focus {
                box-shadow: none !important;
                border-color: transparent !important;
                }`}
            </style>
            <Accordion.Item eventKey={"0"} className="border-0">
              <Accordion.Header className="p-0 border-bottom">
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h5 className="mb-0">Текст задания</h5>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-3" style={{ borderTop: 0 }}>
                <ReadOnlyRichText content={content} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="d-flex justify-content-center mb-3">
            <Form>
              <Form.Group controlId="formFile" className="mb-3">
                {!selectedFile && !task && (
                  <>
                    <Form.Label>
                      <FileEarmarkWord size={20} className="me-2" />
                      Выберите файл с выполненным заданием
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".docx"
                      onChange={handleFileSelect}
                    />
                  </>
                )}
              </Form.Group>

              {error && (
                <Alert variant="danger" className="py-2">
                  {error}
                </Alert>
              )}

              {(selectedFile || task) && (
                <div className="mb-3">
                  <Stack
                    direction="horizontal"
                    gap={3}
                    className="align-items-center"
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <FileEarmarkWord />
                        {selectedFile && <span>{selectedFile.name}</span>}
                        {task && <a href={task.path}>{task.name}</a>}
                      </div>
                    </div>
                    {task && !task.isAccepted && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={handleDelete}
                        disabled={!task && !selectedFile}
                      >
                        <Trash />
                      </Button>
                    )}
                  </Stack>

                  {!task && selectedFile && (
                    <div className="d-grid gap-2 mt-3">
                      <Button variant="primary" onClick={handleUpload}>
                        <Upload className="me-2" />
                        Загрузить выполненное задание
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Form>
          </div>

          <ListGroup className="d-flex align-items-center">
            <h5 className="my-3">Комментарии преподавателя:</h5>
            {comments.map((comment) => (
              <MessageBubble
                key={comment.id}
                message={comment.text}
                timestamp={comment.created}
              />
            ))}
            {comments.length === 0 && <div>Нет комментариев</div>}
          </ListGroup>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default BorderlessAccordion;
