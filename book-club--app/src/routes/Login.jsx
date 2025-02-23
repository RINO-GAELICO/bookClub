import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing the navigation hook
// import usersData from "../mockData/users.json";  // Import mock user data
import { api } from "../api"; // Import the API module

import useAuth from "../context/useAuth"; // Import the custom hook for auth context

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to display login error
    const { login } = useAuth(); // Destructure login function from auth context
    const navigate = useNavigate(); // Hook to handle navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/users/login", {
                email,
                password
            });

            if (response.status !== 200) {
                throw new Error("Invalid email or password.");
            }

            const user = response.data;
            setError(""); // Clear any previous errors
            login(user); // Update auth context with user info
            navigate("/"); // Redirect to home page

        } catch (error) {
            setError(error.message || "Something went wrong. Please try again.");
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
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Show error message if login fails */}
            <div className="login-button-div">
                <button type="submit">Login</button>
            </div>
            {/* Link to Register page */}
            <div className="register-link">
                <p>
                    Don&apos;t have an account?{" "}
                    <a href="/register">Sign up here</a>
                </p>
            </div>
        </form>
    );
}
