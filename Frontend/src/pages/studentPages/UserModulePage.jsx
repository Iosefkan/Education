import Layout from "../../components/Layout";
import TestCard from "../../components/cards/TestCard";
import TheoryCard from "../../components/cards/TheoryCard";
import { getTheories } from "../../services/shared.service";
import { getTests } from "../../services/student.service";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tab, Nav, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserModulePage = () => {
    const [tests, setTests] = useState([]);
    const [theories, setTheories] = useState([]);
    const { state } = useLocation();
    const [activeKey, setActiveKey] = useState('theory');
    const { moduleId, moduleTitle } = state;

    useEffect(() => {
        async function initTests(){
            const recTest = await getTests(moduleId);
            setTests(recTest)
        }
        initTests();
    }, [moduleId, setTests])

    useEffect(() => {
        async function initTheory(){
            const rec = await getTheories(moduleId);
            setTheories(rec)
        }
        initTheory();
    }, [moduleId, setTheories])

  return (
    <Layout>
       <Container fluid className="mt-5">
            <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="theory">Лекционные материалы</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="tests">Практические материалы</Nav.Link>
                            </Nav.Item>
                        </Nav>
                   </Col>
                   <Col sm={10}>
                      <Tab.Content>
                        <Tab.Pane eventKey="theory">
                            <div className="mb-5">
                            <h1>Раздел "{moduleTitle}"</h1>
                            </div>
        
                            <h3 className="mb-3">Лекционные материалы:</h3>
                            <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                            {theories.length === 0 && (
                                <div>Нет лекций</div>
                            )}
                            {theories.map((theory) => (
                                <TheoryCard
                                key={theory.id}
                                id={theory.id}
                                moduleId={moduleId}
                                title={theory.name}
                                canDelete={false}
                                isStudent={true}
                                />
                            ))}
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="tests">
                            <div className="mb-5">
                            <h1>Раздел "{moduleTitle}"</h1>
                            </div>

                            <h3 className="mb-3">Практические материалы:</h3>
                            <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                                {tests.length === 0 && (
                                    <div>Нет практики</div>
                                )}
                                {tests.map((test) => (
                                    <TestCard
                                    key={test.id}
                                    id={test.id}
                                    moduleId={moduleId}
                                    title={test.name}
                                    canDelete={false}
                                    isStudent={true}
                                    />
                                ))}
                            </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    </Layout>
  );
};

export default UserModulePage;