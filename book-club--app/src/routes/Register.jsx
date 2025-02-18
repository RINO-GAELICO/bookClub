import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Fetch mock data (can be replaced with API later)
            const response = await fetch("/src/mockData/users.json");
            const users = await response.json();

            // Check if email or username already exists
            const userExists = users.some(
                (user) => user.email === email || user.username === username
            );

            if (userExists) {
                setError("Username or email already exists.");
            } else {
                // Create new user
                const newUser = { username, email, password };
                users.push(newUser);

                // Save mock data (for now, we won't persist it on the backend)
                await fetch("/src/mockData/users.json", {
                    method: "POST",
                    body: JSON.stringify(users),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                login(newUser); // Log in the newly registered user
                navigate("/forum"); // Redirect to the forum after successful registration
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="register-button">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
