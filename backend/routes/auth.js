const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const AUTH_USER = {
  email: 'admin@proconnect.test',
  password: 'Password123',
  name: 'ProConnect Admin',
};

const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email !== AUTH_USER.email || password !== AUTH_USER.password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email: AUTH_USER.email, name: AUTH_USER.name }, jwtSecret, {
    expiresIn: '8h',
  });

  res.json({ token, user: { email: AUTH_USER.email, name: AUTH_USER.name } });
});

module.exports = router;
