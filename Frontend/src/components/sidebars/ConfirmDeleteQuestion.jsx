import { Modal, Button } from 'react-bootstrap';

const ConfirmDeleteQuestion = ({ onDelete, show, onHide }) => {


  const handleDelete = () => {
    onHide();
    onDelete();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Подтверждение удаления</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы уверены, что хотите удалить данный вопрос"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отменить
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteQuestion;