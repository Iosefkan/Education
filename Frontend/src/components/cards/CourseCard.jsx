import { useState } from 'react';
import { Card, Dropdown, Modal, Button } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import '../../css/card.css';

const CourseCard = ({ id, title, description, dueDate, canDelete = false, onDelete, isStudent = false }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  const onClick = () => { 
    navigate(isStudent ? '/userCourse' : '/course', { state: { courseId: id, courseTitle: title }});
  };

  return (
    <>
      <Card onClick={onClick} className="mb-3 shadow-sm" style={{ width: '350px', height: '200px', cursor: 'pointer' }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">{title}</Card.Title>
          {canDelete && (<div onClick={e => e.stopPropagation()}>
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
          </div>)}

        </Card.Header>

        <Card.Body>
          <Card.Text className="text-muted text-truncate text-wrap">
            {description}
          </Card.Text>
        </Card.Body>

        <Card.Footer>
          <Card.Text className="mt-2 text-muted small">
            Дата сдачи: {new Date(dueDate).toLocaleDateString()}
          </Card.Text>
        </Card.Footer>
      </Card>



      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить курс "{title}"?
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

export default CourseCard;