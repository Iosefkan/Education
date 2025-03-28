import { useState } from 'react';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';

const CreateCourseModal = ({ show, onHide, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Введите название курса';
    if (!description.trim()) newErrors.description = 'Введите описание';
    if (!dueDate) newErrors.dueDate = 'Укажите дату сдачи';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onCreate({
      name: title,
      description,
      date: dueDate
    });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Создание нового курса</Modal.Title>
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

          <FloatingLabel controlId="description" label="Описание" className="mb-3">
            <Form.Control
              as="textarea"
              style={{ height: '100px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="dueDate" label="Дата сдачи">
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              isInvalid={!!errors.dueDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dueDate}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" type="submit">
            Создать курс
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateCourseModal;