import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";
import Home from "./Home.jsx";
// import App from "./App.jsx";
import AuthLayout from "./routes/AuthLayout.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import "./index.css";
import Forum from "./routes/Forum.jsx";
import Proposals from "./routes/Proposals.jsx";
import Navbar from "./components/NavBar.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <main>
            <Navbar />
            <div className="min-h-screen w-full flex items-center justify-center">
            <Routes>
                <Route index element={<Home />} />

                <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                <Route path="/forum" element={<Forum />} />
                <Route path="/proposals" element={<Proposals />} />
            </Routes>
            </div>
        </main>
    </BrowserRouter>
);
