import { Navigate } from 'react-router-dom';

export default function AdminRoute({ auth, children }) {
  if (auth.role !== 'admin') {
    return (
      <Navigate
        to='/dashboard'
        replace
      />
    );
  }
  return children;
}
