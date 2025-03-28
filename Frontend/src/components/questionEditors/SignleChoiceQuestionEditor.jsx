import { useState } from 'react';
import { Alert, Button, Form, ListGroup, Card } from 'react-bootstrap';
import { PlusCircle, Trash } from 'react-bootstrap-icons';

const SingleChoiceQuestionEditor = ({ question, onSave }) => {
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [questionWeight, setQuestionWeight] = useState('');
  const [answers, setAnswers] = useState(question?.answers || []);
  const [correctAnswerId, setCorrectAnswerId] = useState(question?.correctAnswerId || null);
  const [errors, setErrors] = useState({});

  const addAnswer = () => {
    const newAnswer = {
      id: `scq${answers.length + 1}`,
      text: ''
    };
    setAnswers([...answers, newAnswer]);
  };

  const deleteAnswer = (answerId) => {
    const updatedAnswers = answers.filter(a => a.id !== answerId);
    setAnswers(updatedAnswers);
    if (correctAnswerId === answerId) {
      setCorrectAnswerId(null);
    }
  };

  const handleAnswerChange = (answerId, newText) => {
    setAnswers(answers.map(a => 
      a.id === answerId ? { ...a, text: newText } : a
    ));
  };

  const handleValidateQuestionWeight = (e) => {
    if (e.target.value < 0){
      e.target.value = '';
    }
  }

  const validate = () => {
    const newErrors = {};
    if (!questionWeight) newErrors.weight = 'Введите вес вопроса';
    if (!questionText.trim()) newErrors.question = 'Заполните текст вопроса';
    if (answers.some(a => !a.text.trim())) newErrors.answers = 'Заполните текст всех ответов';
    if (!correctAnswerId) newErrors.correctAnswer = 'Выберите верный ответ';
    if (answers.length < 2) newErrors.answersCount = 'Должно быть как минимум два ответа';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    const questionData = {
      type: 1,
      text: questionText,
      weight: questionWeight,
      answers: answers.map(({ id, text, weight }) => ({ id, text, weight })),
      correctAnswerId
    };
    
    onSave(questionData);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Form.Group className="mb-4">
          <Form.Label>Текст вопроса</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            isInvalid={!!errors.question}
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
          <h5>Ответы</h5>
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
            <ListGroup.Item key={answer.id} className="d-flex align-items-center gap-3 py-3">
              <Form.Check 
                type="radio"
                name="correctAnswer"
                id={`correct-${answer.id}`}
                checked={correctAnswerId === answer.id}
                onChange={() => setCorrectAnswerId(answer.id)}
                className="flex-shrink-0"
              />
              
              <Form.Control
                value={answer.text}
                onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                placeholder="Введите текст ответа"
                isInvalid={!!errors.answers && !answer.text.trim()}
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

        {errors.correctAnswer && (
          <Alert variant="danger" className="mt-3">
            {errors.correctAnswer}
          </Alert>
        )}

        <div className="d-flex justify-content-end mt-4 gap-2">
          <Button variant="primary" onClick={handleSave}>
            Сохранить вопрос
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SingleChoiceQuestionEditor;