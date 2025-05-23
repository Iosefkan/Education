import { useState } from "react";
import { Card, ListGroup, Badge, Button } from "react-bootstrap";
import ShortAnswerQuestionEditor from "../questionEditors/ShortAnswerQuestionEditor";
import ConfirmDeleteQuestion from "../sidebars/ConfirmDeleteQuestion";

const ShortAnswerQuestionViewer = ({
  onUpdate,
  onDelete,
  questionText,
  questionWeight,
  questionId,
  correctAnswer,
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
                Ввод ответа
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
              <h5>Правильный ответ</h5>
              <ListGroup>
                <ListGroup.Item className="py-3">
                  {correctAnswer}
                </ListGroup.Item>
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
        <ShortAnswerQuestionEditor
          onSave={(data) => { onUpdate({...data, id}); setShowEdit(false);}}
          initText={questionText}
          initAnswer={correctAnswer}
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

export default ShortAnswerQuestionViewer;
