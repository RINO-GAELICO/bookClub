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
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import RedirectToForum from "./routes/RedirectToForum.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <BrowserRouter>
            <main>
                <Navbar />
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route index element={<Home />} />
                    <Route path="/forum" element={<PrivateRoute element={<RedirectToForum />} />} />
                    <Route path="/forum/:week" element={<PrivateRoute element={<Forum />} />} />
                    <Route path="/proposals/*" element={<PrivateRoute element={<Proposals />} />} />
                </Routes>
            </main>
        </BrowserRouter>
    </AuthProvider>
);
