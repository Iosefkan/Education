import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { isSigned } from '../services/auth.service';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setAuth] = useState(null);

  useEffect(() => {
    async function getIsSigned(){
      const authenticated = await isSigned();
      setAuth(authenticated);
    }
    getIsSigned();
  }, [setAuth]);

  if (isAuthenticated === null) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Checking authentication...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;