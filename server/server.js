const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-super-secret-key-that-should-be-in-a-env-file'; // In production, use environment variables!

// Middleware
app.use(cors());
app.use(express.json());

// --- In-Memory Database for MVP ---
// In a real app, you would use MongoDB, PostgreSQL, etc.
let users = [
  // We'll add a default user for easy testing
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav@test.com',
    passwordHash: bcrypt.hashSync('password123', 10), // Hashed password
    school: 'Greenwood High',
    points: 1250,
    acceptedChallenges: [2],
    completedChallenges: [3],
  },
];
let nextUserId = 2;

const challenges = [
    { id: 1, title: "Waste Segregation Challenge", description: "Correctly segregate your household waste for one week. Submit a photo of your bins.", points: 50, category: "Waste Management" },
    { id: 2, title: "Plant a Sapling", description: "Plant a native tree in your community or backyard. Submit a photo with your new plant.", points: 100, category: "Biodiversity" },
    { id: 3, title: "Energy Audit", description: "Identify and unplug 5 'vampire' appliances that consume power even when off.", points: 75, category: "Energy Conservation" },
    { id: 4, title: "Plastic-Free Lunch", description: "Pack and eat a lunch that uses zero single-use plastic. Share a picture of your sustainable meal!", points: 40, category: "Waste Management" },
];
// --- End of Database ---

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

// --- API Endpoints ---

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, school } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
        id: nextUserId++,
        name,
        email,
        passwordHash,
        school,
        points: 0,
        acceptedChallenges: [],
        completedChallenges: [],
    };
    users.push(newUser);
    res.status(201).json({ message: 'User created successfully!' });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const accessToken = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
});

// CHALLENGE ROUTES
app.get('/api/challenges', (req, res) => {
    res.json(challenges);
});

app.get('/api/challenges/:id', (req, res) => {
    const challenge = challenges.find(c => c.id === parseInt(req.params.id));
    if (challenge) {
        res.json(challenge);
    } else {
        res.status(404).json({ message: 'Challenge not found' });
    }
});

// PROTECTED ROUTES (Require Authentication)
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Don't send password hash to the client
  const { passwordHash, ...userData } = user;
  res.json(userData);
});

app.post('/api/challenges/:id/complete', authenticateToken, (req, res) => {
    const challengeId = parseInt(req.params.id);
    const user = users.find(u => u.id === req.user.id);
    const challenge = challenges.find(c => c.id === challengeId);

    if (!user || !challenge) return res.status(404).json({ message: 'User or challenge not found.' });

    if (!user.completedChallenges.includes(challengeId)) {
        user.completedChallenges.push(challengeId);
        user.points += challenge.points;
    }

    const { passwordHash, ...userData } = user;
    res.json(userData);
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});