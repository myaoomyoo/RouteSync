const User = require('../models/User');

exports.getStudentDashboard = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  if (user.role !== 'student') return res.redirect('/login');
  res.render('dashboard-student', { user });
};

exports.getDriverDashboard = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  if (user.role !== 'driver') return res.redirect('/login');
  res.render('dashboard-driver', { user });
};

exports.getOperatorDashboard = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  if (user.role !== 'operator') return res.redirect('/login');
  res.render('dashboard-operator', { user });
};

// --- Operator Functions ---

exports.getStudentList = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const operator = await User.findById(req.session.userId);
  if (operator.role !== 'operator') return res.redirect('/login');

  const students = await User.find({ role: 'student' });
  res.render('operator-student-list', { user: operator, students });
};

exports.getDriverList = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const operator = await User.findById(req.session.userId);
  if (operator.role !== 'operator') return res.redirect('/login');

  const drivers = await User.find({ role: 'driver' });
  res.render('operator-driver-list', { user: operator, drivers });
};

exports.getUserProfile = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const operator = await User.findById(req.session.userId);
    if (operator.role !== 'operator') return res.redirect('/login');

    const userProfile = await User.findById(req.params.id);
    if (!userProfile) {
        // Handle user not found
        return res.status(404).send('User not found');
    }

    res.render('operator-user-profile', { user: operator, userProfile });
};