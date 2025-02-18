import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Importing the navigation hook
import usersData from "../mockData/users.json";  // Import mock user data

import useAuth from "../context/useAuth";  // Import the custom hook for auth context

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  // State to display login error
    const { login } = useAuth();  // Destructure login function from auth context
    const navigate = useNavigate();  // Hook to handle navigation

    const handleSubmit = (e) => {
        e.preventDefault();

        // Search for a user matching email and password
        const user = usersData.find(
            (user) => user.email === email && user.password === password
        );

        if (user) {
            setError("");  // Clear error if login is successful
            login(user);  // Call the login function to update the context
            navigate("/");  // Redirect to home page
        } else {
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && <p className="error-message">{error}</p>}  {/* Show error message if login fails */}

            <div className="login-button-div">
                <button type="submit">Login</button>
            </div>

            {/* Link to Register page */}
            <div className="register-link">
                <p>Don&apos;t have an account? <a href="/register">Sign up here</a></p>
            </div>
        </form>
    );
}
