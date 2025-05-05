import { useState } from "react";
import { Card, ListGroup, Badge, Button } from "react-bootstrap";
import MultipleChoiceQuestionEditor from "../questionEditors/MultipleChoiceQuestionEditor";
import ConfirmDeleteQuestion from "../sidebars/ConfirmDeleteQuestion";

const MultipleChoiceQuestionViewer = ({
  onUpdate,
  onDelete,
  questionId,
  questionText,
  options,
  questionWeight,
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
                Несколько ответов
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
              <h5>Варианты ответов</h5>
              <ListGroup>
                {options.map((option) => (
                  <ListGroup.Item
                    key={option.id}
                    variant={option.correct ? "success" : ""}
                    className="d-flex justify-content-between align-items-center py-3"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-2">{option.correct && "✓ "}</span>
                      {option.text}
                    </div>
                    <Badge pill bg="light" text="dark">
                      Вес: {option.weight}
                    </Badge>
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
        <MultipleChoiceQuestionEditor
          onSave={(data) => { onUpdate({...data, id}); setShowEdit(false);}}
          initText={questionText}
          initAnswers={options}
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

export default MultipleChoiceQuestionViewer;
