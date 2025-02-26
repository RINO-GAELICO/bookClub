import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { api } from "../api";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // Assuming you have a login function for managing the session

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/users/register",
                { username, email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 201) {
                const { accessToken, ...user } = response.data;
                login(user, accessToken);
                setError("");
                navigate("/");
            } else {
                setError(
                    response.data.error ||
                        "Something went wrong, please try again."
                );
            }
        } catch (err) {
            console.error("Error:", err);
            setError(
                err.response?.data?.error ||
                    "Something went wrong. Please try again."
            );
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
