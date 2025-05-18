import { useEffect, useState } from 'react';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import { PersonPlus } from 'react-bootstrap-icons';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { getRoles } from '../../services/users.service'

const CreateUserModal = ({ show, onHide, onCreateUser }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    role: 1
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function initRoles(){
        const recRoles = await getRoles();
        setRoles(recRoles)
    }
    initRoles();
  }, [setRoles])

  const validateForm = () => {
    const newErrors = {};
    if (!formData.login) newErrors.login = 'Введите логин';
    if (!formData.password) newErrors.password = 'Введите пароль';
    if (!formData.firstName) newErrors.firstName = 'Введите имя';
    if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onCreateUser(formData);
    handleReset();
    onHide();
  };

  const handleReset = () => {
    setFormData({
      login: '',
      password: '',
      firstName: '',
      lastName: '',
      middleName: '',
      role: 1
    });
    setErrors({});
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-right"
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          <PersonPlus className="me-2" />
          Создание нового пользователя
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="login" label="Логин" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Логин"
              value={formData.login}
              onChange={(e) => setFormData({...formData, login: e.target.value})}
              isInvalid={!!errors.login}
            />
            <Form.Control.Feedback type="invalid">
              {errors.login}
            </Form.Control.Feedback>
          </FloatingLabel>

          {/* <FloatingLabel controlId="password" label="Пароль" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              isInvalid={!!errors.login}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </FloatingLabel> */}

          <FloatingLabel controlId="password" label="Пароль" className="mb-3">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                isInvalid={!!errors.password}
              />
              {!errors.password && (<Button
                variant="link"
                className="position-absolute end-0 top-50 translate-middle-y pe-2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                    <EyeSlash className="text-secondary" />
                ) : (
                    <Eye className="text-secondary" />
                )}
              </Button>)}
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
          </FloatingLabel>

          <div className="row g-3 mb-3">
            <div className="col">
              <FloatingLabel controlId="lastName" label="Фамилия">
                <Form.Control
                  type="text"
                  placeholder="Фамилия"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
            <div className="col">
              <FloatingLabel controlId="firstName" label="Имя">
                <Form.Control
                  type="text"
                  placeholder="Имя"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
            <div className="col">
              <FloatingLabel controlId="middleName" label="Отчество">
                <Form.Control
                  type="text"
                  placeholder="Отчество"
                  value={formData.middleName}
                  onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                />
              </FloatingLabel>
            </div>
          </div>

          <FloatingLabel controlId="role" label="Роль" className="mb-4">
            <Form.Select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" size="lg">
              Создать пользователя
            </Button>
            <Button variant="outline-secondary" onClick={handleReset}>
              Очистить форму
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// Add this CSS to your stylesheet


// Usage example:


export default CreateUserModal;