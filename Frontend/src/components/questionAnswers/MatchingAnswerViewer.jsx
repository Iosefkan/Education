import { Card, Row, Col, ListGroup, Badge } from "react-bootstrap";

const MatchingAnswerViewer = ({
  questionText,
  questionWeight,
  questionScore,
  questionId,
  matches,
}) => {

  console.log(matches);
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Вопрос {questionId}</h5>
        <div>
          <Badge pill bg="secondary" className="me-2">
            Баллы: {questionScore.toFixed(2)}/{questionWeight.toFixed(2)}
          </Badge>
          <Badge pill bg="secondary">
            Соотнесение
          </Badge>
        </div>
      </Card.Header>

      <Card.Body>
        <h3 className="mb-4">{questionText}</h3>
        <div className="mb-3">
          <Row className="g-3 align-items-center">
            <Col md={5}>
              <Card.Text className="d-flex text-center">
                <h5 className="w-100">Вариант</h5>
              </Card.Text>
            </Col>
            <Col md={1}></Col>
            <Col md={5}>
              <Card.Text className="d-flex text-center">
                <h5 className="w-100">Пара</h5>
              </Card.Text>
            </Col>
          </Row>
          <ListGroup>
            {matches.map((match, index) => (
              <ListGroup.Item
                key={index}
                className="py-3"
                variant={match.isCorrect ? "success" : "danger"}
              >
                <Row className="g-3 align-items-center">
                  <Col md={5}>
                    <Card.Text className="d-flex text-center">
                      <div className="w-100">{match.left}</div>
                    </Card.Text>
                  </Col>
                  <Col md={1} className="text-center d-flex align-items-center">
                    <div className="w-100">→</div>
                  </Col>
                  <Col md={5}>
                    <Card.Text className="d-flex text-center">
                      <div className="w-100">{match.right}</div>
                    </Card.Text>
                  </Col>
                  <Col md={1} className="d-flex justify-content-end">
                    <Badge bg="light" text="dark">
                      Балл: {match.weight}
                    </Badge>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MatchingAnswerViewer;
