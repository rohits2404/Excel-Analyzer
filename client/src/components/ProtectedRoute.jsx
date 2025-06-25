import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner'; // ✅

const ProtectedRoute = ({ role }) => {
    
    const { user, loading } = useAuth();

    if (loading) return <Spinner />; // ✅ Use spinner

    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;

    return <Outlet />;
};

export default ProtectedRoute;