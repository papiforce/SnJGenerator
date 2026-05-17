import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function NavBar() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/administration");

  return (
    <nav className="sg-nav">
      <Link to="/" className="sg-nav__brand">
        Sengoku <em>no Jidai</em>
      </Link>
      <div className="sg-nav__end">
        <Link
          to="/"
          className={`sg-nav__link${!isAdmin ? " is-active" : ""}`}
        >
          Fiches
        </Link>
        <Link
          to="/administration"
          className={`sg-nav__link${isAdmin ? " is-active" : ""}`}
        >
          Administration
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
