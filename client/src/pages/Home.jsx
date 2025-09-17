import React from 'react';
import { Link } from 'react-router-dom';
import Scene from '../components/Scene';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-text">
        <h2>Level Up Your Planet.</h2>
        <p>
          An interactive gamified platform transforming environmental education in
          India's schools and colleges. Turn learning into action.
        </p>
        <Link to="/challenges" className="button">
          Start a Challenge
        </Link>
      </div>
      <div className="hero-3d">
        <Scene />

      </div>
    </div>
  );
};

export default Home;