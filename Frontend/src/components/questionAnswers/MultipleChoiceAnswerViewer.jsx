import { Card, ListGroup, Badge, Form } from "react-bootstrap";

const MultipleChoiceAnswerViewer = ({
  questionText,
  questionWeight,
  questionScore,
  questionId,
  options,
}) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Вопрос {questionId}</h5>
        <div>
          <Badge pill bg="secondary" className="me-2">
            Баллы: {questionScore.toFixed(2)}/{questionWeight.toFixed(2)}
          </Badge>
          <Badge pill bg="secondary">
            Несколько ответов
          </Badge>
        </div>
      </Card.Header>

      <Card.Body>
        <h3 className="mb-4">{questionText}</h3>

        <div className="mb-3">
          <ListGroup>
            {options.map((option) => (
              <ListGroup.Item
                key={option.id}
                variant={
                  option.isAnswer
                    ? option.isCorrect
                      ? "success"
                      : "danger"
                    : ""
                }
                className="d-flex justify-content-between align-items-center py-3"
              >
                <div className="d-flex justify-content-between gap-3">
                  {option.isAnswer && (
                    <Form.Check
                      type="checkbox"
                      disabled={true}
                      id={`option-${option.id}`}
                      checked={true}
                    />
                  )}

                  <div className="d-flex align-items-center">{option.text}</div>
                </div>
                <Badge bg="light" text="dark">
                  Балл: {option.weight}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MultipleChoiceAnswerViewer;
