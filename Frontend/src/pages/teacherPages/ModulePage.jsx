import Layout from "../../components/Layout";
import TestCard from "../../components/cards/TestCard";
import TheoryCard from "../../components/cards/TheoryCard";

import SingleChoiceQuestionEditor from "../../components/questionEditors/SingleChoiceQuestionEditor";
import MultipleChoiceQuestionEditor from "../../components/questionEditors/MultipleChoiceQuestionEditor";
import MatchingQuestionEditor from "../../components/questionEditors/MatchingQuestionEditor";
import ShortAnswerQuestionEditor from "../../components/questionEditors/ShortAnswerQuestionEditor";

import transformQuestionEditorToQuestion from "../../services/questionTransform";

import CreateTestModal from "../../components/sidebars/CreateTestModal";
import CreateTheoryModal from "../../components/sidebars/CreateTheoryModal";
import {
  deleteTask,
  deleteTheory,
  createTest,
  createTheory,
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "../../services/teacher.service";
import { getTests, getTheories } from "../../services/shared.service";
import { useState, useEffect } from "react";
import { Button, Tab, Nav, Container, Row, Col, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import BaseQuestionViewer from "../../components/questionViewers/BaseQuestionViewer";
import PaginatedData from "../../components/PaginatedData";
import BaseQuestionEditor from "../../components/questionEditors/BaseQuestionEditor";

const ModulePage = () => {
  const [selectedType, setSelectedType] = useState(1);
  const [questions, setQuestions] = useState([]);
  const questionTypes = [
    "Вопрос с одним ответом",
    "Вопрос с несколькими ответами",
    "Вопрос с соотнесением",
    "Вопрос с вводом ответа",
  ];

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const [activeKey, setActiveKey] = useState("theory");
  const [tests, setTests] = useState([]);
  const [theories, setTheories] = useState([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const { state } = useLocation();
  const { moduleId, moduleTitle } = state;

  useEffect(() => {
    async function initTests() {
      const recTest = await getTests(moduleId);
      setTests(recTest);
    }
    initTests();
  }, [moduleId, setTests]);

  useEffect(() => {
    async function InitTheories() {
      const recTest = await getTheories(moduleId);
      setTheories(recTest);
    }
    InitTheories();
  }, [moduleId, setTheories]);

  useEffect(() => {
    async function initQuestions() {
      let recQuestions = await getQuestions(moduleId);
      recQuestions = recQuestions.map((q) => {
        return { ...q, answer: JSON.parse(q.answer) };
      });
      setQuestions(recQuestions);
    }
    initQuestions();
  }, [moduleId, setQuestions]);

  const handleCreateTest = async (testData) => {
    const newTest = await createTest(moduleId, testData.name);
    setTests([...tests, newTest]);
  };

  const handleDeleteTest = async (test) => {
    await deleteTask(test.id);
    setTests(tests.filter((m) => m.id !== test.id));
  };

  const handleCreateTheory = async (theoryData) => {
    const newTheory = await createTheory(moduleId, theoryData.name);
    setTheories([...theories, newTheory]);
  };

  const handleDeleteTheory = async (theory) => {
    await deleteTheory(theory.id);
    setTests(theories.filter((m) => m.id !== theory.id));
  };

  const handleCreateQuestion = async (questionData) => {
    const body = JSON.stringify(
      transformQuestionEditorToQuestion(questionData)
    );
    const weight = questionData.weight;
    delete questionData.weight;
    const type = questionData.type;
    delete questionData.type;
    const text = questionData.text;
    delete questionData.text;
    const answer = JSON.stringify(questionData);
    const response = await createQuestion(
      moduleId,
      type,
      body,
      answer,
      weight,
      text
    );
    console.log(response);
    setQuestions([...questions, { ...response, answer: JSON.parse(response.answer)}]);
    console.log(questions);
  };

  const handleUpdateQuestion = async (questionData) => {
    const body = JSON.stringify(
      transformQuestionEditorToQuestion(questionData)
    );
    const weight = questionData.weight;
    delete questionData.weight;
    delete questionData.type;
    const text = questionData.text;
    delete questionData.text;
    const answer = JSON.stringify(questionData);
    await updateQuestion(questionData.id, body, answer, weight, text);

    setQuestions(
      questions.map((q) =>
        q.id !== questionData.id
          ? q
          : { id: q.id, answer: questionData, text, weight, type: q.type }
      )
    );
  };

  const handleDeleteQuestion = async (questionId) => {
    await deleteQuestion(questionId);
    setQuestions(questions.filter((q) => q.id != questionId));
  };

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
                <Nav.Item>
                  <Nav.Link eventKey="questions">Вопросы</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="theory">
                  <div className="mb-5 d-flex flex-row align-items-center gap-5">
                    <h1>Раздел "{moduleTitle}"</h1>
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowTheoryModal(true)}
                    >
                      Добавить лекцию
                    </Button>
                  </div>

                  <h3 className="mb-3">Созданные лекции:</h3>
                  <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                    {theories.length === 0 && <div>Нет лекций</div>}
                    {theories.map((theory) => (
                      <TheoryCard
                        key={theory.id}
                        id={theory.id}
                        moduleId={moduleId}
                        title={theory.name}
                        canDelete={true}
                        onDelete={() => handleDeleteTheory(theory)}
                      />
                    ))}
                  </div>

                  <CreateTheoryModal
                    show={showTheoryModal}
                    onHide={() => setShowTheoryModal(false)}
                    onCreate={(courseData) => handleCreateTheory(courseData)}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="tests">
                  <div className="mb-5 d-flex flex-row align-items-center gap-5">
                    <h1>Раздел "{moduleTitle}"</h1>
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowTestModal(true)}
                    >
                      Добавить практический материал
                    </Button>
                  </div>

                  <h3 className="mb-3">Созданные материалы:</h3>
                  <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                    {tests.length === 0 && <div>Нет заданий</div>}
                    {tests.map((test) => (
                      <TestCard
                        key={test.id}
                        id={test.id}
                        moduleId={moduleId}
                        title={test.name}
                        canDelete={true}
                        onDelete={() => handleDeleteTest(test)}
                      />
                    ))}
                  </div>

                  <CreateTestModal
                    show={showTestModal}
                    onHide={() => setShowTestModal(false)}
                    onCreate={(courseData) => handleCreateTest(courseData)}
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

                      <BaseQuestionEditor
                        type={selectedType}
                        onCreate={handleCreateQuestion}
                      />
                    </Form>
                  </div>

                  <div className="mt-5">
                    <h3>Список вопросов:</h3>
                    <PaginatedData
                      data={questions.sort((a, b) => b.id - a.id)}
                      pageSizeOptions={[5, 10, 15]}
                      length={questions.length}
                      isLoading={false}
                    >
                      <BaseQuestionViewer
                        onUpdate={handleUpdateQuestion}
                        onDelete={handleDeleteQuestion}
                      />
                    </PaginatedData>
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
