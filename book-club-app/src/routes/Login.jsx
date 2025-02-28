import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import useAuth from "../context/useAuth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/users/login",
                { email, password },
                { withCredentials: true }
            );

            if (response.status !== 200) {
                throw new Error("Invalid email or password.");
            }

            console.log(`Login response: ${JSON.stringify(response.data)}`);

            const { accessToken, ...user } = response.data;
            login(user, accessToken);
            // save avatar in local storage
            localStorage.setItem("avatar", user.avatar);
            console.log(`User logged in: ${JSON.stringify(user)}`);
            console.log(`Access Token: ${accessToken}`);
            setError("");
            navigate("/");
        } catch (error) {
            setError(
                "Invalid email or password."
            );
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
