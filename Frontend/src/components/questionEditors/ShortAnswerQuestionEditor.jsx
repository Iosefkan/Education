import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const ShortAnswerQuestionEditor = ({ question, onSave }) => {
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [questionWeight, setQuestionWeight] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(question?.answer || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!questionWeight) newErrors.weight = 'Введите вес вопроса';
    if (!questionText.trim()) newErrors.question = 'Заполните текст вопроса';
    if (!correctAnswer.trim()) newErrors.answer = 'Заполните ответ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidateQuestionWeight = (e) => {
    if (e.target.value < 0){
      e.target.value = '';
    }
  }

  const handleSave = () => {
    if (!validate()) return;
    
    onSave({
      type: 4,
      text: questionText,
      answer: correctAnswer,
      weight: questionWeight
    });
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


        <Form.Group className="mb-4">
          <Form.Label>Ответ</Form.Label>
          <Form.Control
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            isInvalid={!!errors.answer}
            placeholder="Введите ответ"
          />
          <Form.Control.Feedback type="invalid">
            {errors.answer}
          </Form.Control.Feedback>
        </Form.Group>

        {Object.keys(errors).length > 0 && (
          <Alert variant="danger" className="mb-3">
            Исправьте ошибки перед сохранением
          </Alert>
        )}

        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleSave}>
            Сохранить вопрос
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ShortAnswerQuestionEditor;