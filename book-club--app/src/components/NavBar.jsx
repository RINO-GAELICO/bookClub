import { NavLink } from "react-router";

function NavBar() {
    return (
        <nav>
            {/* NavLink makes it easy to show active states */}
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
            >
                Home
            </NavLink>

            {/* a list of links */}

            <ul>
                <li>
                    <NavLink
                        to="/forum"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Forum
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/proposals"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Proposals
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
