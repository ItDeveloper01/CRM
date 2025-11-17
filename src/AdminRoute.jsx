import { Navigate } from 'react-router-dom';
import { Roles } from './Constants';

export default function AdminRoute({ auth, children }) {

    // If you still need to check if user is logged in:
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  
 console.log('auth Object......', auth);
 console.log('children Object......', children);

 // if (auth.role !== Roles.SUPER_ADMIN) {
  //  if (auth.role !== Roles.ADMIN) {
      // console.log('auth.role', auth.role);
      // return (
      //   <Navigate
      //     to='/dashboard'
      //     replace
      //   />
      // );
    //}
  //}
  return children;
}
