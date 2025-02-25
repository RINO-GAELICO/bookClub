import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import clsx from "clsx";
import "../css/NavBar.css";
import useAuth from "../context/useAuth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Forum", path: "/forum" },
    { name: "Proposals", path: "/proposals" },
];

function NavBar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { user } = useAuth();
    const handleClick = (event) => {
        if (!user) {
            navigate("/login");
        } else {
            setAnchorEl(event.currentTarget);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const { logout } = useAuth();

    console.log(user);

    // Handle logout and redirect to home page
    const handleLogout = () => {
        handleClose();
        logout(); // Log out the user
        // Redirect to home page
        console.log("User logged out");
        navigate("/login");
    };
    return (
        <nav className="bg-gray-800">
            <div className="px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            {/* <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          --> */}
                            <svg
                                className="block size-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                            {/* <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          --> */}
                            <svg
                                className="hidden size-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                            {/* a list of links */}

                            <ul>
                                <div className="flex space-x-4">
                                    {navLinks.map((link) => (
                                        <li key={link.name}>
                                            <NavLink
                                                to={link.path}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive && "active",
                                                        "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 custom-font"
                                                    )
                                                }
                                            >
                                                {link.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* <!-- Profile dropdown --> */}
                        {/* Mobile menu button */}
                        <Button
                            id="demo-positioned-button"
                            aria-controls={
                                open ? "demo-positioned-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        >
                            {/* if user: welcome username , if not Login button*/}
                            {user ? `Welcome, ${user.username}` : "Login"}
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}


                        >
                            <MenuItem
                            onClick={handleLogout}
                            >Logout</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
