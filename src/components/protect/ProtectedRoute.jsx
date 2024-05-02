import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('tutor-token');

    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const getCookie = (name) => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name))
      ?.split('=')[1];
    return cookieValue || null;
  };

  return <>{children}</>;
};

export default ProtectedRoute;
