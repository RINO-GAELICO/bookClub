// PrivateRoute component to protect routes that require authentication
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../context/useAuth"; // Import the useAuth hook

const PrivateRoute = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
};

export default PrivateRoute;
