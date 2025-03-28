import { useState } from 'react';
import { Card, Badge, Form, Button } from 'react-bootstrap';

const ShortAnswerQuestion = ({
  questionId,
  questionText,
  isReadonly = false,
  onSave
}) => {
  const [answer, setAnswer] = useState('');

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{questionText}</h5>
        <Badge pill bg="secondary">
          Ввод ответа
        </Badge>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId={`shortAnswer-${questionId}`}>
            <Form.Label srOnly>Ответ</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              readOnly={isReadonly}
              className="mb-3"
              placeholder="Введите ответ"
              aria-describedby={`helpText-${questionId}`}
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-4 gap-2">
            <Button variant="primary" onClick={() => onSave(answer)}>
              Сохранить вопрос
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ShortAnswerQuestion;