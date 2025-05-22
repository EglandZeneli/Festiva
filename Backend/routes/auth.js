
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const router   = express.Router();
const User     = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration, login & token refresh
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: user|organiser|admin
 *     responses:
 *       '200':
 *         description: Access token + user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Server error
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash, role: role || 'user' });

    // create access token
    const accessToken = jwt.sign(
      {
        id:       user._id,
        username: user.username,
        email:    user.email,
        role:     user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success:     true,
      accessToken,
      user: {
        username: user.username,
        email:    user.email,
        role:     user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user and set a refresh-token cookie
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Access token returned & refresh token set in cookie
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly refreshToken
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *       '400':
 *         description: Invalid credentials or missing fields
 *       '500':
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 1) Create the access token
    const accessToken = jwt.sign(
      {
        id:       user._id,
        username: user.username,
        email:    user.email,
        role:     user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 2) Create the refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_EXPIRES_IN }
    );

    // 3) Send the refresh token as an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path:     '/auth/refresh',
      maxAge:   1000 * 60 * 60 * 24 * 7 // 7 days
    });

    // 4) Return the access token
    res.json({ success: true, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh your access token using the refresh-token cookie
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *       '401':
 *         description: No refresh token cookie
 *       '403':
 *         description: Invalid or expired refresh token
 */
// Middleware to authenticate user for POST, PUT, DELETE
router.post('/refresh', (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'No refresh token' });
    }
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);
    const newAccess = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ success: true, accessToken: newAccess });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
