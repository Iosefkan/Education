import { useState, useEffect } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { Link45deg, FileWord, BodyText } from 'react-bootstrap-icons';
import { useLocation } from "react-router-dom";
import { getTheoryText, getTheoryDocs, getTheoryLinks } from '../../services/shared.service';
import ReadOnlyRichText from '../../components/ReadOnlyRichText';
import Layout from '../../components/Layout';

const UserTheoryMaterialPage = () => {
  const { state } = useLocation();
  const { theoryId, theoryTitle } = state;

  const [files, setFiles] = useState([]);

  const [links, setLinks] = useState([]);

  const [content, setContent] = useState('');

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

  return (
    <Layout>
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
                <ReadOnlyRichText 
                  content={content} 
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
                  </div>
                ))}
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
                  </div>
                </li>
                ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default UserTheoryMaterialPage;