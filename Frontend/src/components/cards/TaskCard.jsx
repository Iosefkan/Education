import { useState } from "react";
import { Card, Dropdown, Modal, Button } from "react-bootstrap";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "../../css/card.css";

const TaskCard = ({
  id,
  title,
  isAccepted = false,
  isUpdated = false,
  canDelete = false,
  onDelete,
  isStudent = false,
  grade
}) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  const onClick = () => {
    navigate(isStudent ? "/task" : "/makeTask", {
      state: { taskId: id, taskTitle: title },
    });
  };

  return (
    <>
      <Card
        onClick={onClick}
        className="mb-3 shadow-sm"
        style={{ width: "350px", height: "150px", cursor: "pointer" }}
      >
        <Card.Header className="h-100 d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0 text-wrap">
            {title}
            {isStudent && isAccepted && <span className="text-primary"> (оценка {grade})</span>}
            {isStudent && !isAccepted && isUpdated && <span className="text-primary"> (обновлено)</span>}
          </Card.Title>
          {canDelete && (
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-menu"
                  className="p-0"
                >
                  <ThreeDotsVertical />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setShowDeleteModal(true)}
                    className="text-danger"
                  >
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </Card.Header>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить задание "{title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отменить
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskCard;
