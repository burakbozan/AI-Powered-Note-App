const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

function createToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

exports.register = asyncHandler(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body.password;

  if (!email || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'A valid email and password of at least 8 characters are required.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });
  const safeUser = { id: user.id, email: user.email, createdAt: user.createdAt };
  res.status(201).json({ user: safeUser, token: createToken(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body.password;
  const user = await User.unscoped().findOne({ where: { email } });

  if (!user || typeof password !== 'string' || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Email or password is incorrect.' });
  }

  const safeUser = { id: user.id, email: user.email, createdAt: user.createdAt };
  res.json({ user: safeUser, token: createToken(user) });
});