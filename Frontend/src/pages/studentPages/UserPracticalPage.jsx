import SingleChoiceQuestion from "../../components/questions/SingleChoiceQuestion";
import MultipleChoiceQuestion from "../../components/questions/MultipleChoiceQuestion";
import MatchingQuestion from "../../components/questions/MatchingQuestion";
import ShortAnswerQuestion from "../../components/questions/ShortAnswerQuestion";
import Layout from "../../components/Layout";
import TaskCard from "../../components/cards/TaskCard";
import { Button, Alert, Modal, Tab, Container, Col, Row, Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getPracticalQuestions,
  getTestResult,
} from "../../services/student.service";
import { getTasks } from "../../services/shared.service";

const UserPracticalPage = () => {
  const { state } = useLocation();
  const { practId, practTitle } = state;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState({ grade: 2, percent: 20 });
    const [activeKey, setActiveKey] = useState("tasks");
    const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function InitQuestions() {
      let recQuestions = await getPracticalQuestions(practId);
      recQuestions = recQuestions.map((q) => {
        return { ...q, body: JSON.parse(q.body) };
      });
      setQuestions(recQuestions);
      setAnswers(
        recQuestions.map((q) => {
          return { id: q.id };
        })
      );
    }
    InitQuestions();
  }, [practId, setQuestions, setAnswers]);

    useEffect(() => {
      async function InitTasks() {
        let rec = await getTasks(practId);
        setTasks(rec);
      }
      InitTasks();
    }, [practId, setTasks]);

  const validate = () => {
    let newErrors = "";
    if (answers.some((answ) => Object.keys(answ).length === 1))
      newErrors = "Заполните ответы на все вопросы";

    setError(newErrors);
    return !newErrors;
  };

  const checkResult = async () => {
    if (!validate()) return;
    const testResult = await getTestResult(answers);
    setResult(testResult);
    setShowResultModal(true);
  };

  return (
    <Layout>
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
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="tasks">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>

                  <h3 className="mb-3">Задания:</h3>
                  <div className="d-flex flex-wrap justify-content-start align-items-center gap-4">
                    {tasks.length === 0 && <div>Нет заданий</div>}
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.name}
                        canDelete={false}
                        isStudent={true}
                      />
                    ))}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="test">
                  <div className="mb-5">
                    <h1>Практический материал "{practTitle}"</h1>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}
                  <Button
                    className="w-100 mb-5"
                    style={{ height: "65px" }}
                    onClick={checkResult}
                  >
                    Проверить результат
                  </Button>

                  {questions.map((option) =>
                    option.type == 1 ? (
                      <SingleChoiceQuestion
                        key={option.id}
                        questionId={option.id}
                        questionText={option.text}
                        options={option.body.options}
                        isReadonly={false}
                        onSelect={(ans) =>
                          setAnswers(
                            answers.map((a) =>
                              a.id === option.id ? { ...a, answer: ans } : a
                            )
                          )
                        }
                      />
                    ) : option.type == 2 ? (
                      <MultipleChoiceQuestion
                        key={option.id}
                        questionId={option.id}
                        questionText={option.text}
                        options={option.body.options}
                        isReadonly={false}
                        onSelect={(ans) =>
                          setAnswers(
                            answers.map((a) =>
                              a.id === option.id
                                ? { ...a, answer: JSON.stringify(ans) }
                                : a
                            )
                          )
                        }
                      />
                    ) : option.type == 3 ? (
                      <MatchingQuestion
                        key={option.id}
                        questionId={option.id}
                        questionText={option.text}
                        leftItems={option.body.leftItems}
                        rightItems={option.body.rightItems}
                        isReadonly={false}
                        onMatch={(ans) =>
                          setAnswers(
                            answers.map((a) =>
                              a.id === option.id
                                ? { ...a, answer: JSON.stringify(ans) }
                                : a
                            )
                          )
                        }
                      />
                    ) : option.type == 4 ? (
                      <ShortAnswerQuestion
                        key={option.id}
                        questionId={option.id}
                        questionText={option.text}
                        isReadonly={false}
                        onSave={(ans) =>
                          setAnswers(
                            answers.map((a) =>
                              a.id === option.id ? { ...a, answer: ans } : a
                            )
                          )
                        }
                      />
                    ) : (
                      <></>
                    )
                  )}

                  {error && (
                    <Alert variant="danger" className="mt-5">
                      {error}
                    </Alert>
                  )}
                  <Button
                    className={error ? "w-100" : "w-100 mt-5"}
                    style={{ height: "65px" }}
                    onClick={checkResult}
                  >
                    Проверить результат
                  </Button>

                  <Modal
                    show={showResultModal}
                    onHide={() => setShowResultModal(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Результат теста</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Вы - большой молодец!!!
                      <br />
                      Ваша оценка за тест - {result.grade}
                      <br />
                      Выполнено {result.score}, {result.percent}
                    </Modal.Body>
                  </Modal>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
};

export default UserPracticalPage;
