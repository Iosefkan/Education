import { useState, useEffect } from 'react';
import { Accordion, Button, Card, Alert } from 'react-bootstrap';
import { FileWord, BodyText } from 'react-bootstrap-icons';
import { useLocation } from "react-router-dom";
import RichTextEditor from '../../components/RichTextEditor';
import { getTaskFiles, updateTaskText } from '../../services/teacher.service';
import { getTaskText } from "../../services/shared.service";
import Layout from '../../components/Layout';

const MakeTheoryMaterialPage = () => {
  const { state } = useLocation();
  const { taskId, taskTitle } = state;

  const [taskFiles, setTaskFiles] = useState([]);

  const [content, setContent] = useState('');
  const [saveMessage, setSaveMessage] = useState({});

  useEffect(() => {
    async function initTaskFiles(){
        const rec = await getTaskFiles(taskId);
        setTaskFiles(rec)
    }
    initTaskFiles();
  }, [taskId, setTaskFiles])

  useEffect(() => {
    async function initText(){
        const recText = await getTaskText(taskId);
        setContent(recText)
    }
    initText();
  }, [taskId, setContent])

  const handleUpdateText = async () => {
    const result = await updateTaskText(taskId, content);
    if (!result) {
      setSaveMessage({ isError: true, message: 'Ошибка при обновлении задания'})
    }
    else {
      setSaveMessage({ isError: false, message: 'Задание успешно обновлена'})
    }

    setTimeout(() => setSaveMessage({}), 5000);
  }

  return (
    <Layout>
      <Card className="shadow-lg">
        <Card.Header className="bg-light">
          <h2>{taskTitle}</h2>
        </Card.Header>

        <Card.Body>
          <Accordion defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
              <Accordion.Header>
                <BodyText className="p-3 border-0" /> Текст задания
              </Accordion.Header>
              <Accordion.Body>
                {saveMessage.message && (
                  <Alert variant={saveMessage.isError ? "danger" : "success"} className="mt-3">
                    {saveMessage.message}
                  </Alert>
                )}
                <Button 
                  className="mb-3"
                  onClick={() => handleUpdateText()}
                >
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
                <FileWord className="me-2" /> Выполненные задания ({taskFiles.length})
              </Accordion.Header>
              <Accordion.Body>
                {taskFiles.map((file) => (
                  <div key={file.id} className="mb-3 d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                      <div className="fw-bold">Выполнивший студент: {file.fullName}</div>
                      <a href={file.path}>{file.name}</a>
                    </div>
                  </div>
                ))}
            
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default MakeTheoryMaterialPage;