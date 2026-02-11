import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../api/token.utils";

const ProtectedRoute: React.FC = () => {
    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/auth" replace />;
    }

    // Render children if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
