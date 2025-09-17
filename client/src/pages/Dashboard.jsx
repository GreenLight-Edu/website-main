import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading your Eco-Stats...</p>;
  if (!user) return <p>Please log in to see your dashboard.</p>;

  const badges = [ // Define badges based on points
    { name: "Recycle Rookie", icon: "♻️", points: 100 },
    { name: "Energy Saver", icon: "💡", points: 250 },
    { name: "Waste Warrior", icon: "🗑️", points: 500 },
    { name: "Eco-Hero", icon: "🦸", points: 1000 },
  ];

  const earnedBadges = badges.filter(badge => user.points >= badge.points);

  return (
    <div className="dashboard-container">
      <h1>Welcome back, {user.name}!</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Points</h3>
          <p className="points">{user.points} ✨</p>
        </div>
        <div className="stat-card">
          <h3>Challenges Done</h3>
          <p>{user.completedChallenges.length}</p>
        </div>
         <div className="stat-card">
          <h3>School</h3>
          <p>{user.school}</p>
        </div>
      </div>
      <div className="badges-section">
        <h2>Your Badges</h2>
        {earnedBadges.length > 0 ? (
            <div className="badges-grid">
            {earnedBadges.map((badge) => (
                <div key={badge.name} className="badge-card">
                <span className="badge-icon">{badge.icon}</span>
                <p>{badge.name}</p>
                </div>
            ))}
            </div>
        ) : (
            <p>Complete more challenges to earn badges!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;