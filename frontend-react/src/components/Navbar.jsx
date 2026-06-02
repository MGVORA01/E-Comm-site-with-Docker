import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory }) => {
  const { cart } = useContext(AppContext);
  const getInitialTheme = () => localStorage.getItem("theme") || "light-theme";
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = ["Laptop","Headphone","Mobile","Electronics","Toys","Fashion"];

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(`http://localhost:8080/API/Products/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch {
        setSearchResults([]); setNoResults(true);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]); setNoResults(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => { document.body.className = theme; }, [theme]);

  return (
    <nav className="pro-navbar">
      <div className="pro-navbar__inner">
        <a href="/" className="pro-navbar__brand">
          ShopMG<span className="pro-navbar__brand-dot" />
        </a>

        <ul className="pro-navbar__links">
          <li><a href="/" className="nav-link active">Home</a></li>
          <li><a href="/add_product">Add Product</a></li>
          <li className="pro-nav-dropdown">
            <button>Categories ▾</button>
            <div className="pro-nav-dropdown__menu">
              {categories.map(cat => (
                <button
                  key={cat}
                  className="pro-nav-dropdown__item"
                  onClick={() => onSelectCategory(cat)}
                >{cat}</button>
              ))}
            </div>
          </li>
        </ul>

        <div className="pro-navbar__search">
          <i className="bi bi-search pro-navbar__search-icon" />
          <input
            className="pro-navbar__search-input"
            type="search"
            placeholder="Search products..."
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            onFocus={() => input.length >= 1 && setShowSearchResults(true)}
          />
          {showSearchResults && (
            <div className="pro-search-results">
              {searchResults.length > 0 ? searchResults.map(r => (
                <a key={r.id} href={`/product/${r.id}`} className="pro-search-result-item">
                  <i className="bi bi-box me-2" />{r.name}
                </a>
              )) : noResults && (
                <div className="pro-search-result-item" style={{color:'var(--text-muted)'}}>
                  No products found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pro-navbar__actions">
          <button className="pro-icon-btn" onClick={toggleTheme} title="Toggle theme">
            <i className={`bi bi-${theme === "dark-theme" ? "moon-fill" : "sun-fill"}`} />
          </button>
          <a href="/cart" className="pro-icon-btn" title="Cart">
            <i className="bi bi-bag" />
            {cartCount > 0 && <span className="pro-cart-badge">{cartCount}</span>}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
