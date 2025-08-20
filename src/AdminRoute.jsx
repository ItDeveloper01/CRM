import { Navigate } from 'react-router-dom';

export default function AdminRoute({ auth, children }) {
  if (auth.role !== 'Super Admin') {
    if (auth.role !== 'admin') {
      console.log('auth.role', auth.role);
      return (
        <Navigate
          to='/dashboard'
          replace
        />
      );
    }
  }
  return children;
}
