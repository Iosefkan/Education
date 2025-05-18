import { Container, Navbar, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { logout, getName } from "../services/auth.service";

const Layout = ({ paths, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getBreadcrumbs = () => {
    return paths.map((path) => (
      <Breadcrumb.Item
        style={{ textDecoration: 'none' }}
        linkAs={Link}
        linkProps={{ to: path.to, state: path.state }}
        key={path.id}
        active={path.active}
      >
        {path.label}
      </Breadcrumb.Item>
    ));
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand>Система тестирования. Пользователь: {getName()}</Navbar.Brand>
          <Nav>
            <Nav.Link onClick={handleLogout}>Выход</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container fluid className="mt-2 mb-4">
        <Breadcrumb>{getBreadcrumbs()}</Breadcrumb>
        {children}
      </Container>
    </>
  );
};

export default Layout;
