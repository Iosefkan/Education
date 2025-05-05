import { Card, Row, Col, ListGroup, Badge, Button } from "react-bootstrap";
import { useState } from "react";
import MatchingQuestionEditor from "../questionEditors/MatchingQuestionEditor";
import ConfirmDeleteQuestion from "../sidebars/ConfirmDeleteQuestion";

const MatchingQuestionViewer = ({
  onUpdate,
  onDelete,
  questionText,
  questionWeight,
  questionId,
  matches,
  id
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      {!showEdit && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Вопрос {questionId}</h5>
            <div>
              <Badge pill bg="secondary" className="me-2">
                Вес вопроса: {questionWeight}
              </Badge>
              <Badge pill bg="secondary">
                Соотнесение
              </Badge>
            </div>
          </Card.Header>

          <Card.Body>
            <div className="mb-4">
              <h5>Текст вопроса</h5>
              <Card.Text className="border p-2 rounded bg-light">
                {questionText}
              </Card.Text>
            </div>
            <div className="mb-3">
              <h5>Cоотнесения</h5>
              <ListGroup>
                {matches.map((match, index) => (
                  <ListGroup.Item key={index} className="py-3">
                    <Row className="g-3 align-items-center">
                      <Col md={5}>
                        <Card.Text className="p-2 rounded bg-white">
                          {match.left.text}
                        </Card.Text>
                      </Col>
                      <Col md={5}>
                        <Card.Text className="p-2 rounded bg-white">
                          {match.right.text}
                        </Card.Text>
                      </Col>
                      <Col md={2}>
                        <Badge pill bg="light" text="dark">
                          Вес: {match.weight}
                        </Badge>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <div className="d-flex justify-content-end mt-4 gap-2">
              <Button variant="primary" onClick={() => setShowEdit(true)}>
                Редактировать вопрос
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Удалить вопрос
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      {showEdit && (
        <MatchingQuestionEditor
          onSave={(data) => { onUpdate({...data, id}); setShowEdit(false);}}
          initText={questionText}
          initMatches={matches.map((m, ind) => {
            return {
              left: m.right.text,
              right: m.left.text,
              weight: m.weight,
              id: ind,
            };
          })}
          initWeight={questionWeight}
          showCancel
          onCancel={() => setShowEdit(false)}
          id={questionId}
        />
      )}

      <ConfirmDeleteQuestion
        onDelete={onDelete}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default MatchingQuestionViewer;
