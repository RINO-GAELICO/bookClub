import { Navigate } from "react-router-dom";

export default function RedirectToForum() {
    return <Navigate to="/forum/1" replace />;
}