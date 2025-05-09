import { Card, ListGroup, Badge } from "react-bootstrap";

const SingleChoiceAnswerViewer = ({
  questionText,
  questionWeight,
  questionScore,
  questionId,
  answers
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
            Один ответ
          </Badge>
        </div>
      </Card.Header>

      <Card.Body>
        <h3 className="mb-4">{questionText}</h3>

        <div className="mb-3">
          <ListGroup>
            {answers?.map((answer) => (
              <ListGroup.Item
                key={answer.id}
                variant={
                  answer.isAnswer
                    ? answer.isCorrect
                      ? "success"
                      : "danger"
                    : ""
                }
                className="py-3"
              >
                {answer.text}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SingleChoiceAnswerViewer;
