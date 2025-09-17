import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ChallengeDetail.css';

const ChallengeDetail = () => {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [message, setMessage] = useState('');
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/challenges/${id}`)
            .then(res => setChallenge(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleComplete = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post(`/api/challenges/${id}/complete`);
            setMessage(`Challenge completed! You earned ${challenge.points} points.`);
            // In a real app, you might want to update the global user state here.
        } catch (err) {
            console.error(err);
            setMessage('Failed to complete challenge.');
        }
    };

    if (!challenge) return <p>Loading challenge...</p>;

    const isCompleted = user?.completedChallenges.includes(challenge.id);

    return (
        <div className="challenge-detail-container">
            <span className="points-badge-detail">{challenge.points} Points</span>
            <h1>{challenge.title}</h1>
            <p className="category-tag-detail">{challenge.category}</p>
            <p className="description">{challenge.description}</p>

            {isCompleted ? (
                <p className="completed-message">✅ You have already completed this challenge!</p>
            ) : (
                <button onClick={handleComplete} className="button">
                    Mark as Complete
                </button>
            )}
            {message && <p className="action-message">{message}</p>}
        </div>
    );
};

export default ChallengeDetail;