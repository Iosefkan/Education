import { useState } from 'react';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';

const CreateTestModal = ({ show, onHide, onCreate }) => {
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Введите название практики';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onCreate({
      name: title
    });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Создание новой практики</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <FloatingLabel controlId="title" label="Название" className="mb-3">
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" type="submit">
            Создать практику
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTestModal;