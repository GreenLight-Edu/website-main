import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Challenges.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/challenges')
      .then((res) => {
        setChallenges(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch challenges:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading challenges...</p>;

  return (
    <div className="challenges-container">
      <h1>Available Challenges</h1>
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <div className="card-header">
              <h3>{challenge.title}</h3>
              <span className="points-badge">{challenge.points} Points</span>
            </div>
            <p className="category-tag">{challenge.category}</p>
            <p>{challenge.description}</p>
            <Link to={`/challenges/${challenge.id}`} className="button">
              View Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;