import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaSearch, FaRegSmile, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ▼ click-to-open dropdown state
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // close when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/products?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">FREAKY FASHION.</NavLink>
      </div>

      <ul className="nav-links">
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Herr</NavLink></li>
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Dam</NavLink></li>

        {/* ▼ Dropdown (click-to-open) */}
        <li className={`dropdown ${open ? "open" : ""}`} ref={dropdownRef}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setOpen(o => !o)}
            aria-haspopup="true"
            aria-expanded={open}
          >
            Kategorier <span className="caret">▾</span>
          </button>
          <ul className="dropdown-menu" role="menu">
            <li><NavLink to="/category/premier-league" className={({isActive}) => (isActive ? "active" : "")}>Premier League</NavLink></li>
            <li><NavLink to="/category/vm"             className={({isActive}) => (isActive ? "active" : "")}>VM</NavLink></li>
            <li><NavLink to="/category/sverige"        className={({isActive}) => (isActive ? "active" : "")}>Sverige</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active sale" : "sale")}>Rea</NavLink></li>
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Kampanjer</NavLink></li>
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Varumärken</NavLink></li>
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Freaky Mag.</NavLink></li>
      </ul>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Sök..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit"><FaSearch /></button>
      </form>

      <div className="nav-icons">
        <FaRegSmile className="icon" />
        <FaRegHeart className="icon" />
        <FaShoppingBag className="icon" />
      </div>
    </nav>
  );
};

export default Navbar;

