// ProtectedRoute.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.user);
  
  // Check if the user exists or if there is a demo user in localStorage
  const demoUser = JSON.parse(localStorage.getItem('user'));
  
  if (!user && !(demoUser && demoUser.email === 'demoUser@test.com')) {
    return <Navigate to='/register' />;
  }

  return children;
};

export default ProtectedRoute;
