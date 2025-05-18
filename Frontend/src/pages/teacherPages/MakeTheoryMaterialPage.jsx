import { useState, useEffect } from 'react';
import { Accordion, Form, Button, Card, Modal, Alert } from 'react-bootstrap';
import { PlusCircle, Trash, Link45deg, FileWord, BodyText } from 'react-bootstrap-icons';
import { useLocation } from "react-router-dom";
import RichTextEditor from '../../components/RichTextEditor';
import { updateTheoryText,
  createTheoryDoc, deleteDoc,
  createTheoryLink, deleteLink,
 } from '../../services/teacher.service';
import { getTheoryText, getTheoryDocs, getTheoryLinks } from "../../services/shared.service";
import { getModuleCrumbs, getCourseCrumbs } from '../../services/crumbsHelper';
import Layout from '../../components/Layout';

const MakeTheoryMaterialPage = () => {
  const { state } = useLocation();
  const { theoryId, theoryTitle } = state;
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
      to: "/makeTheory",
      id: 4,
      state: state,
      label: `Лекция "${theoryTitle}"`,
    },
  ];

  const [files, setFiles] = useState([]);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ file: null, description: '' });

  const [links, setLinks] = useState([]);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLink, setNewLink] = useState({ link: '', description: '' });

  const [fileErrors, setFileErrors] = useState({});
  const [linkErrors, setLinkErrors] = useState({});

  const [content, setContent] = useState('');
  const [saveMessage, setSaveMessage] = useState({});

  useEffect(() => {
    async function initDocs(){
        const recDocs = await getTheoryDocs(theoryId);
        setFiles(recDocs)
    }
    initDocs();
  }, [theoryId, setFiles])

  useEffect(() => {
    async function initText(){
        const recText = await getTheoryText(theoryId);
        setContent(recText)
    }
    initText();
  }, [theoryId, setContent])

  useEffect(() => {
      async function initLinks(){
          const recLinks = await getTheoryLinks(theoryId);
          setLinks(recLinks)
      }
      initLinks();
  }, [theoryId, setLinks])

  const handleShowAddDoc = () => setShowAddDocModal(true);
  const handleCloseAddDoc = () => {
    setShowAddDocModal(false);
    setNewDoc({ file: null, description: '' });
    setFileErrors({});
  };

  const handleShowAddLink = () => setShowAddLinkModal(true);
  const handleCloseAddLink = () => {
    setShowAddLinkModal(false);
    setNewLink({ link: '', description: '' });
    setLinkErrors({});
  };

  const validateDocument = () => {
    const newErrors = {};
    if (!newDoc.file) newErrors.file = 'Добавьте файл';
    if (!newDoc.description.trim()) newErrors.description = 'Введите описание';
    setFileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidHttpUrl = (str) => {    
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  const validateLink = () => {
    const newErrors = {};
    if (!newLink.link) newErrors.link = 'Введите адрес ссылки';
    if (newLink.link && !isValidHttpUrl(newLink.link)) newErrors.link = 'Введите валидный адрес ссылки';
    if (!newLink.description.trim()) newErrors.description = 'Введите описание';
    setLinkErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDocument = async () => {
    if (!validateDocument()) return;
    
    const document = await createTheoryDoc(theoryId, newDoc.file, newDoc.description);
    
    setFiles([...files, document]);
    handleCloseAddDoc();
  };

  const handleAddLink = async () => {
    if (!validateLink()) return;
  
    const link = await createTheoryLink(theoryId, newLink.link, newLink.description);
    
    setLinks([...links, link]);
    handleCloseAddLink();
  };

  const handleUpdateText = async () => {
    const result = await updateTheoryText(theoryId, content);
    if (!result) {
      setSaveMessage({ isError: true, message: 'Ошибка при обновлении лекции'})
    }
    else {
      setSaveMessage({ isError: false, message: 'Лекция успешно обновлена'})
    }

    setTimeout(() => setSaveMessage({}), 5000);
  }

  // Existing file and link handlers
  const deleteFile = async (id) => {
    await deleteDoc(id);
    setFiles(files.filter(f => f.id !== id));
  }

  const delLink = async (id) => {
    await deleteLink(id);
    setLinks(links.filter(l => l.id !== id));
  }

  return (
    <Layout paths={paths}>
      <Card className="shadow-lg">
        <Card.Header className="bg-light">
          <h2>{theoryTitle}</h2>
        </Card.Header>

        <Card.Body>
          <Accordion defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
              <Accordion.Header>
                <BodyText className="me-2" /> Текст лекции
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
                  Сохранить текст лекции
                </Button>
                <RichTextEditor 
                  value={content} 
                  onChange={(value) => setContent(value)}
                  placeholder="Текст лекции..."
                />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <FileWord className="me-2" /> Документы ({files.length})
              </Accordion.Header>
              <Accordion.Body>
                {files.map((file) => (
                  <div key={file.id} className="mb-3 d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                      <div className="fw-bold">{file.description}</div>
                      <a href={file.path}><small className="text-muted">{file.name}</small></a>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => deleteFile(file.id)}>
                      <Trash />
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline-primary" onClick={handleShowAddDoc} className="mt-2">
                  <PlusCircle className="me-2" /> Добавить документ
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <Link45deg className="me-2" /> Ссылки ({links.length})
              </Accordion.Header>
              <Accordion.Body>
                <ul className="mb-0">
                {links.map((link) => (
                <li key={link.id}>
                  <div className="mb-3 d-flex justify-content-between align-items-start gap-2">
                    <div className="flex-grow-1">
                      <a 
                        href={link.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="fw-bold text-break"
                      >
                        {link.description}
                      </a>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => delLink(link.id)}
                      className="flex-shrink-0 ms-2"
                    >
                      <Trash />
                    </Button>
                  </div>
                </li>
                ))}
                </ul>
                <Button variant="outline-primary" onClick={handleShowAddLink} className="mt-2">
                  <PlusCircle className="me-2" /> Добавить ссылку
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Modal show={showAddDocModal} onHide={handleCloseAddDoc}>
            <Modal.Header>
              <Modal.Title>Добавить документ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Документы (.docx, .pptx)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".docx, .pptx"
                    onChange={(e) => setNewDoc({ ...newDoc, file: e.target.files[0] })}
                    isInvalid={!!fileErrors.file}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fileErrors.file}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Описание</Form.Label>
                  <Form.Control
                    as="textarea" rows={2}
                    value={newDoc.description}
                    onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                    isInvalid={!!fileErrors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fileErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddDoc}>
                Отменить
              </Button>
              <Button variant="primary" onClick={handleAddDocument}>
                Добавить документ
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showAddLinkModal} onHide={handleCloseAddLink}>
            <Modal.Header>
              <Modal.Title>Добавить ссылку</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Адрес ссылки</Form.Label>
                  <Form.Control
                    type="text"
                    value={newLink.link}
                    onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                    isInvalid={!!linkErrors.link}
                  />
                  <Form.Control.Feedback type="invalid">
                    {linkErrors.link}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Описание</Form.Label>
                  <Form.Control
                    as="textarea" rows={2}
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    isInvalid={!!linkErrors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {linkErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddLink}>
                Отменить
              </Button>
              <Button variant="primary" onClick={handleAddLink}>
                Добавить ссылку
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default MakeTheoryMaterialPage;