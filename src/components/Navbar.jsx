import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaRegSmile, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

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
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Skor</NavLink></li>
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
