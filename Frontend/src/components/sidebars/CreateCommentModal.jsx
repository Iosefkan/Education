import { useState } from 'react';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';

const CreateCommentModal = ({ show, onHide, onCreate }) => {
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!comment.trim()) newErrors.comment = 'Введите комментарий';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onCreate(comment);
    handleClose();
  };

  const handleClose = () => {
    setComment('');
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавление комментария</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <FloatingLabel controlId="comment" label="Комментарий" className="mb-3">
            <Form.Control
              type="textarea"
              style={{ height: '100px' }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              isInvalid={!!errors.comment}
            />
            <Form.Control.Feedback type="invalid">
              {errors.comment}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" type="submit">
            Добавить комментарий
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateCommentModal;