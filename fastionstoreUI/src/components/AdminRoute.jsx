import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminUser, isLoggedIn } from '../utils/auth';

const AdminRoute = ({ children }) => {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdminUser()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
