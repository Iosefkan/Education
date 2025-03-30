import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { login, getRole } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [log, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!log || !password) {
      setErrorMessage('Заполните поля');
      return;
    }

    setIsLoading(true);
    try {
      await login(log, password);
      const role = getRole();
      switch (role){
        case 'Администратор':
          navigate('/users');
          break;
        case 'Студент':
          navigate('/userCourses');
          break;
        case 'Преподаватель':
          navigate('/courses');
          break;
        default:
          throw new Error(); 
      }
    } catch{
      setIsLoading(false);
      setErrorMessage('Неверный логин или пароль');
    }
  };

  return (
    <div className="container mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Вход</Card.Title>
          
          <Form onSubmit={handleSubmit}>
            {errorMessage && (
              <Alert variant="danger" className="text-center">
                {errorMessage}
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                value={log}
                onChange={(e) => setLogin(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="visually-hidden">Загрузка...</span>
                  </>
                ) : (
                  'Войти'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;