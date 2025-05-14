import { useState } from "react";
import { Button, Form, ListGroup, Card, Alert, Badge } from "react-bootstrap";
import { PlusCircle, Trash } from "react-bootstrap-icons";
import "../../css/numInput.css";

const MultipleChoiceQuestionEditor = ({
  onSave,
  initText = "",
  initWeight = "",
  initAnswers = [],
  showCancel = false,
  onCancel = null,
  id,
}) => {
  const [questionText, setQuestionText] = useState(initText);
  const [questionWeight, setQuestionWeight] = useState(initWeight);
  const [answers, setAnswers] = useState(initAnswers);
  const [errors, setErrors] = useState({});

  const addAnswer = () => {
    const newAnswer = {
      id: `mcq${answers.length + 1}`,
      text: "",
      weight: "",
      correct: false,
    };
    setAnswers([...answers, newAnswer]);
  };

  const deleteAnswer = (answerId) => {
    setAnswers(answers.filter((a) => a.id !== answerId));
  };

  const handleAnswerChange = (answerId, newText, isWeight) => {
    if (isWeight) {
      setAnswers(
        answers.map((a) => (a.id === answerId ? { ...a, weight: newText } : a))
      );
      return;
    }
    setAnswers(
      answers.map((a) => (a.id === answerId ? { ...a, text: newText } : a))
    );
  };

  const toggleCorrect = (answerId) => {
    setAnswers(
      answers.map((a) =>
        a.id === answerId
          ? {
              ...a,
              correct: !a.correct,
              weight: a.correct === true ? "" : a.weight,
            }
          : a
      )
    );
  };

  const handleKeyDown = (e, answerId, newText) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let newVal = Number(newText) + 0.1;
      handleAnswerChange(answerId, newVal > 1 ? newText : newVal.toFixed(1), true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let newVal = Number(newText) - 0.1;
      handleAnswerChange(answerId, newVal < 0 ? newText : newVal.toFixed(1), true);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
  };

  const handleValidateWeight = (e) => {
    if (e.target.value < 0 || e.target.value > 1) {
      e.target.value = "";
    }
  };

  const handleValidateQuestionWeight = (e) => {
    if (e.target.value < 0) {
      e.target.value = "";
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!questionWeight) newErrors.weight = "Введите вес вопроса";
    let accWeight = answers.reduce((acc, ans) => acc + Number(ans.weight), 0);
    if (Math.abs(accWeight - 1 ) > 0.00001)
      newErrors.accWeight = "Общий вес ответов должен равняться 1";
    if (!questionText.trim()) newErrors.question = "Заполните текст вопроса";
    if (answers.some((a) => !a.text.trim()))
      newErrors.answers = "Заполните текст всех ответов";
    if (answers.some((a) => !a.weight))
      newErrors.answers = "Заполните текст всех ответов";
    if (!answers.some((a) => a.correct))
      newErrors.correct = "Пометьте как минимум один ответ как верный";
    if (answers.length < 2)
      newErrors.answersCount = "Должно быть как минимум два ответа";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const questionData = {
      type: 2,
      text: questionText,
      weight: questionWeight,
      answers: answers.map(({ id, text, correct, weight }) => ({
        id,
        text,
        correct,
        weight,
      })),
    };

    onSave(questionData);
    setQuestionText('');
    setQuestionWeight('');
    setAnswers([]);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Вопрос {id}</h5>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-4">
          <Form.Label>Текст вопроса</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            isInvalid={!!errors.question}
            placeholder="Введите текст вопроса"
          />
          <Form.Control.Feedback type="invalid">
            {errors.question}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Вес вопроса</Form.Label>
          <Form.Control
            type="number"
            value={questionWeight}
            onChange={(e) => {
              handleValidateQuestionWeight(e);
              setQuestionWeight(e.target.value);
            }}
            isInvalid={!!errors.weight}
            placeholder="Введите вес вопроса"
          />
          <Form.Control.Feedback type="invalid">
            {errors.weight}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>
            Ответы
            <Badge bg="secondary" className="ms-2">
              {answers.filter((a) => a.correct).length} помечено как 'верно'
            </Badge>
          </h5>
          <Button variant="outline-primary" onClick={addAnswer}>
            <PlusCircle className="me-2" />
            Добавить ответ
          </Button>
        </div>

        {errors.answersCount && (
          <Alert variant="danger" className="mb-3">
            {errors.answersCount}
          </Alert>
        )}
        {errors.accWeight && (
          <Alert variant="danger" className="mb-3">
            {errors.accWeight}
          </Alert>
        )}

        <ListGroup>
          {answers.map((answer) => (
            <ListGroup.Item
              key={answer.id}
              className="d-flex align-items-center gap-3 py-3"
            >
              <Form.Check
                type="checkbox"
                checked={answer.correct}
                onChange={() => toggleCorrect(answer.id)}
                className="flex-shrink-0"
                aria-label="Mark as correct"
              />

              <Form.Control
                value={answer.text}
                onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                placeholder="Введите текст ответа"
                isInvalid={!!errors.answers && !answer.text.trim()}
              />

              <Form.Control
                className="no-spinners"
                type="number"
                style={{ maxWidth: "100px" }}
                value={answer.weight}
                onChange={(e) => {
                  handleValidateWeight(e);
                  handleAnswerChange(answer.id, e.target.value, true);
                }}
                onKeyDown={(e) => handleKeyDown(e, answer.id, e.target.value)}
                onWheel={handleWheel}
                placeholder="Вес"
                isInvalid={!!errors.answers && !answer.wieght}
              />

              <Button
                variant="outline-danger"
                onClick={() => deleteAnswer(answer.id)}
                className="flex-shrink-0"
                aria-label="Delete answer"
              >
                <Trash />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {errors.correct && (
          <Alert variant="danger" className="mt-3">
            {errors.correct}
          </Alert>
        )}

        <div className="d-flex justify-content-end mt-4 gap-2">
          <Button variant="primary" onClick={handleSave}>
            Сохранить вопрос
          </Button>
          {showCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Отменить редактирование
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MultipleChoiceQuestionEditor;
