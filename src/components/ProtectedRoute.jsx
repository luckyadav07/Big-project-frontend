// ProtectedRoute.jsx — guards pages that require login

// What it does:
// - Wraps any page that should only be visible to logged-in users
// - Checks if a token exists (using useAuth)
// - No token → redirects to /login automatically
// - Has token → shows the page normally

// How to use it (in App.jsx routes):
// <Route path="/jobs" element={
//     <ProtectedRoute>
//         <Jobs />
//     </ProtectedRoute> 
// } />


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    console.log("ProtectedRoute Token:", token);

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;