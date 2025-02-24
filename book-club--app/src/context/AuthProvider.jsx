// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";
import { api } from "../api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData, accessToken) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("accessToken", accessToken);
    };

    const logout = async () => {
        try {
            await api.post("/users/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
    };

    const refreshAccessToken = async () => {
        try {
            const response = await api.post(
                "/users/refresh",
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                sessionStorage.setItem(
                    "accessToken",
                    response.data.accessToken
                );
                return response.data.accessToken;
            }
        } catch (error) {
            console.error("Failed to refresh token:", error);
            logout();
        }
        return null;
    };

    // Fetch user data when app loads or when accessToken is refreshed
    const fetchUserData = async () => {
        try {
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) return;

            const response = await api.get("/users/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });

            if (response.status === 200) {
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            logout();
        }
    };

    useEffect(() => {
        fetchUserData(); // Fetch user data on app load

        const interval = setInterval(() => {
            refreshAccessToken().then(fetchUserData);
        }, 10 * 60 * 1000); // Refresh every 10 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, login, logout, refreshAccessToken }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
