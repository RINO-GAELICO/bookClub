import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import "../css/AuthLayout.css";

export default function AuthLayout() {
  // Set initial theme from localStorage, or default to light theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  // Toggle theme and save preference to localStorage
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    // Apply the theme class to the body element
    document.body.classList.toggle("dark-theme", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`auth-layout ${isDarkMode ? "dark-theme" : ""}`}>
      <div className="auth-container">
        <h1>Welcome to the Book Club</h1>
        <div className="theme-toggle">
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
            <span className="slider round"></span>
          </label>
          <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
        </div>
        {/* This will either render <Login /> or <Register /> */}
        <Outlet />
      </div>
    </div>
  );
}
