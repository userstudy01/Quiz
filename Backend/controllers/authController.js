const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { isEmail, str } = require('../middleware/validate');

const signToken = (user) =>
  jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const email = str(req.body.email, 200).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!isEmail(email) || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  // Same message for unknown email and wrong password (no account enumeration).
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Approval gate. Legacy accounts with no status set are treated as approved.
  if (user.status === 'pending') {
    return res.status(403).json({ message: 'Your account is awaiting super admin approval.' });
  }
  if (user.status === 'rejected') {
    return res.status(403).json({ message: 'Your account request was rejected.' });
  }

  res.json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @route POST /api/auth/register (public sign-up)
// The very first account becomes the approved super admin. Every later sign-up
// is created 'pending' and must be approved by the super admin before it can
// log in.
const register = asyncHandler(async (req, res) => {
  const name = str(req.body.name, 120);
  const email = str(req.body.email, 200).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!name || !isEmail(email) || password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Name, a valid email and a password of at least 8 characters are required' });
  }

  // ADM-003: public sign-up exists only for the first-run case. Once any account
  // exists, registration is closed. The backend is the final authority here, so
  // even a direct API call cannot create a second account.
  const isFirstUser = (await User.estimatedDocumentCount()) === 0;
  if (!isFirstUser) {
    return res.status(403).json({
      message: 'Admin registration is disabled. An administrator account already exists.',
    });
  }

  const exists = await User.findOne({ email }).lean();
  if (exists) {
    return res.status(409).json({ message: 'A user with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'superadmin',
    status: 'approved',
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    isFirstUser,
  });
});

// @route GET /api/auth/registration-open (public)
// ADM-003: tells the admin panel whether first-run sign-up is still available.
// Exposes only a boolean — never any user detail.
const registrationOpen = asyncHandler(async (req, res) => {
  const open = (await User.estimatedDocumentCount()) === 0;
  res.json({ open });
});

// @route GET /api/auth/users (super admin only)
// Lists every account, newest first, so the super admin can act on requests.
const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
  res.json(users);
});

// @route PATCH /api/auth/users/:id (super admin only)
// Approve (optionally assigning a role) or reject a pending account.
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const nextStatus = req.body.status;

  if (!['approved', 'rejected'].includes(nextStatus)) {
    return res.status(400).json({ message: "status must be 'approved' or 'rejected'" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.role === 'superadmin') {
    return res.status(400).json({ message: 'The super admin account cannot be changed.' });
  }

  user.status = nextStatus;
  if (nextStatus === 'approved') {
    user.role = 'admin';
  }
  await user.save();

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
});

// @route GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// @route POST /api/auth/logout
// Tokens are stateless; the client discards it. Endpoint exists so the admin
// panel has a single, explicit place to end a session.
const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};

// @route PUT /api/auth/password
const changePassword = asyncHandler(async (req, res) => {
  const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
  const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  const user = await User.findById(req.user.id);
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
  await user.save();

  res.json({ message: 'Password updated' });
});

module.exports = {
  login,
  register,
  registrationOpen,
  me,
  logout,
  changePassword,
  listUsers,
  updateUser,
};
