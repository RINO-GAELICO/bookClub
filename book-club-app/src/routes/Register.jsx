import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { api } from "../api";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null); // State to store the avatar file
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Prepare form data, including the avatar image if available
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) formData.append("avatar", avatar);

        try {
            const response = await api.post("/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Specify the content type for file upload
                },
            });

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
                <div>
                    <label htmlFor="avatar">Avatar:</label>
                    <input
                        type="file"
                        id="avatar"
                        onChange={(e) => setAvatar(e.target.files[0])} // Store the file in state
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
