import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';
import '../../css/numInput.css';

const AcceptTask = ({ onAccept, show, onHide }) => {
  const [grade, setGrade] = useState(2);
  const [errors, setErrors] = useState({});

  const validateGrade = (e) => {
    e.target.value = Number(e.target.value[e.target.value.length - 1]);
    if (e.target.value < 2) {
      e.target.value = 2;
    }
    if (e.target.value > 5) {
      e.target.value = 5;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!grade) newErrors.grade = 'Введите оценку';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onAccept(grade);
    handleClose();
  };

  const handleClose = () => {
    setGrade(2);
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Выставление оценки</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <FloatingLabel controlId="title" label="Оценка" className="mb-3">
            <Form.Control
              type="number"
              value={grade}
              className="no-spinners"
              onChange={(e) => {
                validateGrade(e);
                setGrade(e.target.value);
              }}
              isInvalid={!!errors.grade}
            />
            <Form.Control.Feedback type="invalid">
              {errors.grade}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" type="submit">
            Принять задание
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AcceptTask;