import { Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand>Система тестирования</Navbar.Brand>
            <Nav>
              <Nav.Link onClick={handleLogout}>Выход</Nav.Link>
            </Nav>
        </Container>
      </Navbar>
      <Container fluid className="mt-4">{children}</Container>
    </>
  );
};

export default Layout;
