import Layout from "../components/Layout";
import TestCard from "../components/TestCard";
import SingleChoiceQuestion from "../components/questions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../components/questions/MultipleChoiceQuestion";
import MatchingQuestion from "../components/questions/MatchingQuestion";
import ShortAnswerQuestion from "../components/questions/ShortAnswerQuestion";

import SingleChoiceQuestionEditor from "../components/questionEditors/SignleChoiceQuestionEditor";
import MultipleChoiceQuestionEditor from "../components/questionEditors/MultipleChoiceQuestionEditor";
import MatchingQuestionEditor from "../components/questionEditors/MatchingQuestionEditor";
import ShortAnswerQuestionEditor from "../components/questionEditors/ShortAnswerQuestionEditor";

import transformQuestionEditorToQuestion from "../services/questionTransform";

import CreateTestModal from "../components/sidebars/CreateTestModal";
import { deleteTest, getTests, createTest, createQuestion, getQuestions } from "../services/teacher.service";
import { useState, useEffect } from "react";
import { Button, Tab, Nav, Container, Row, Col, ListGroup, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const ModulePage = () => {
    const [selectedType, setSelectedType] = useState(1);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const questionTypes = [
      "Вопрос с одним ответом",
      "Вопрос с несколькими ответами",
      "Вопрос с соотнесением",
      "Вопрос с вводом ответа",
    ];
  
  
    const handleTypeChange = (event) => {
      setSelectedType(event.target.value);
    };


    const [activeKey, setActiveKey] = useState('tests');
    const [tests, setTests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { state } = useLocation();
    const { moduleId, moduleTitle } = state;

    useEffect(() => {
        async function initTests(){
            const recTest = await getTests(moduleId);
            setTests(recTest)
        }
        initTests();
    }, [moduleId, setTests])

    useEffect(() => {
        async function initQuestions(){
            let recQuestions = await getQuestions(moduleId);
            recQuestions = recQuestions.map(q => { return {...q, body: JSON.parse(q.body)} })
            setQuestions(recQuestions)
        }
        initQuestions();
    }, [moduleId, setQuestions])

    const handleCreate = async (testData) => {
      const newTest = await createTest(moduleId, testData.name);
      setTests([...tests, newTest])
    }
  
    const handleDelete = async (test) => {
      await deleteTest(test.id);
      setTests(tests.filter(m => m.id !== test.id))
    }

    const handleCreateQuestion = async (questionData) => {
        const body = JSON.stringify(transformQuestionEditorToQuestion(questionData));
        const weight = questionData.weight;
        delete questionData.weight;
        const type = questionData.type;
        delete questionData.type;
        const text = questionData.text;
        delete questionData.text;
        const answer = JSON.stringify(questionData);
        const response = await createQuestion(moduleId, type, body, answer, weight, text);
        response.body = JSON.parse(response.body);
        setQuestions([...questions, response])
    }


  return (
    <Layout>
      <Container fluid className="mt-5">
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="tests">Тесты</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="questions">Вопросы</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="tests">
                  <div className="mb-5 d-flex flex-row align-items-center gap-5">
                    <h1>Модуль "{moduleTitle}"</h1>
                    <Button variant="outline-primary" onClick={() => setShowModal(true)}>
                        Добавить тест
                    </Button>
                  </div>

                  <h3 className="mb-3">Созданные тесты:</h3>
                  <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                    {tests.length === 0 && (
                        <div>Нет тестов</div>
                    )}
                    {tests.map((test) => (
                      <TestCard
                        key={test.id}
                        id={test.id}
                        title={test.name}
                        canDelete={true}
                        onDelete={() => handleDelete(test)}
                        />
                    ))}
                  </div>

                  <CreateTestModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    onCreate={(courseData) => handleCreate(courseData)}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="questions">
                    <div>
                        <h3>Добавить новый вопрос:</h3>
                        <Form>
                            <Form.Group className="mb-3">
                            <Form.Label>Тип вопроса</Form.Label>
                                <Form.Select 
                                value={selectedType} 
                                onChange={handleTypeChange}
                                aria-label="Option selection dropdown"
                                >
                                <option value="1">{questionTypes[0]}</option>
                                <option value="2">{questionTypes[1]}</option>
                                <option value="3">{questionTypes[2]}</option>
                                <option value="4">{questionTypes[3]}</option>
                                </Form.Select>
                            </Form.Group>

                            {selectedType == 1 && (<SingleChoiceQuestionEditor 
                            onSave={(questionData) => handleCreateQuestion(questionData)}
                            />)}

                            {selectedType == 2 && (<MultipleChoiceQuestionEditor 
                            onSave={(questionData) => handleCreateQuestion(questionData)}
                            />)}

                            {selectedType == 3 && (<MatchingQuestionEditor 
                            onSave={(questionData) => handleCreateQuestion(questionData)}
                            />)}

                            {selectedType == 4 && (<ShortAnswerQuestionEditor 
                            onSave={(questionData) => handleCreateQuestion(questionData)}
                            />)}
                        </Form>
                    </div>

                    <div className="mt-5">
                        <h3>Список вопросов:</h3>
                            <ListGroup>
                            {questions.map((question) => (
                                question.type == 1 ? 
                                (<SingleChoiceQuestion
                                key={question.id}
                                questionId={question.id}
                                questionText={question.text}
                                options={question.body.options}
                                onSelect={(id, selectedId) => {
                                    answers[question.id] = { answer: selectedId };
                                    setAnswers(answers);
                                }}
                                />)
                                : question.type == 2 ? 
                                (<MultipleChoiceQuestion
                                key={question.id}
                                questionId={question.id}
                                questionText={question.text}
                                options={question.body.options}
                                onSelect={(id, selectedIds) => {
                                    answers[question.id] = { answer: selectedIds };
                                    setAnswers(answers);
                                }}
                                />)
                                : question.type == 3 ? 
                                (<MatchingQuestion
                                key={question.id}
                                questionId={question.id}
                                questionText={question.text}
                                leftItems={question.body.leftItems}
                                rightItems={question.body.rightItems}
                                onMatch={(id, matches) => {
                                    answers[question.id] = matches
                                    setAnswers(answers);
                                }}
                                />)
                                : question.type == 4 ? 
                                (<ShortAnswerQuestion
                                key={question.id}
                                questionId={question.id}
                                questionText={question.text}
                                isReadonly={false}
                                onSave={(answer) => {
                                    answers[question.id] = { answer };
                                    setAnswers(answers);
                                }}
                                />) : (<></>)
                            ))}
                        </ListGroup>
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

export default ModulePage;