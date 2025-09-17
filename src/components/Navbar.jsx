import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaRegSmile, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  // dropdown open/close
  const [openCat, setOpenCat] = useState(false);
  const catRef = useRef(null);

  // categories from backend
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/categories")
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCat(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
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

        {/* ▼ Categories (click to open, items loaded from API) */}
        <li className={`dropdown ${openCat ? "open" : ""}`} ref={catRef}>
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setOpenCat(o => !o)}
            aria-haspopup="true"
            aria-expanded={openCat}
          >
            Kategorier <span className="caret">▾</span>
          </button>
          <ul className="dropdown-menu" role="menu">
            {categories.map(c => (
              <li key={c.id}>
                <NavLink
                  to={`/category/${c.slug}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setOpenCat(false)}
                  role="menuitem"
                >
                  {c.name}
                </NavLink>
              </li>
            ))}
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
