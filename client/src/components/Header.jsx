import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="app-header">
      <Link to="/" className="logo">
        <h1>🌱 GreenLight</h1>
      </Link>
      <nav>
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/challenges">Challenges</NavLink>
            <button onClick={logout} className="button-logout">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="button">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;