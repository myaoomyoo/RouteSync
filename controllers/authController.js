const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getSignup = (req, res) => {
  res.render('signup');
};

exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).send('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();

  res.status(201).send('User created');
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('login', { error: 'Invalid credentials' });
  }

  req.session.userId = user._id;

  // Check if the user's profile is complete
  if (!user.profileComplete) {
    return res.redirect('/complete-profile');
  }

  // Redirect to the appropriate dashboard
  switch (user.role) {
    case 'student': return res.redirect('/dashboard/student');
    case 'driver': return res.redirect('/dashboard/driver');
    case 'operator': return res.redirect('/dashboard/operator');
    default: return res.redirect('/dashboard');
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect('/dashboard');
    res.redirect('/login');
  });
};

exports.getCompleteProfile = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const user = await User.findById(req.session.userId);

  if (user.profileComplete) {
    // If profile is already complete, send them to their dashboard
    switch (user.role) {
      case 'student': return res.redirect('/dashboard/student');
      case 'driver': return res.redirect('/dashboard/driver');
      case 'operator': return res.redirect('/dashboard/operator');
      default: return res.redirect('/dashboard');
    }
  }

  // Render the appropriate profile completion form
  if (user.role === 'student') {
    res.render('complete-profile-student', { user });
  } else if (user.role === 'driver') {
    res.render('complete-profile-driver', { user });
  } else {
    // Operators don't need to complete a profile in this flow
    // Mark their profile as complete and redirect
    user.profileComplete = true;
    await user.save();
    res.redirect('/dashboard/operator');
  }
};

exports.postCompleteProfileStudent = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const { homeAddress } = req.body;
  const user = await User.findById(req.session.userId);

  if (user && user.role === 'student') {
    user.homeAddress = homeAddress;
    user.profileComplete = true;
    await user.save();
    res.redirect('/dashboard/student');
  } else {
    // Handle error or unauthorized access
    res.redirect('/login');
  }
};

exports.postCompleteProfileDriver = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const {
    age,
    phone,
    vehicleType,
    vehicleName,
    vehicleSize,
    licenseNumber,
    vehicleRegistration
  } = req.body;

  // In a real app, you would handle file upload for aadhaarProofUrl
  // For now, we'll assume it's a string or leave it empty.

  const user = await User.findById(req.session.userId);

  if (user && user.role === 'driver') {
    user.age = age;
    user.phone = phone;
    user.vehicleType = vehicleType;
    user.vehicleName = vehicleName;
    user.vehicleSize = vehicleSize;
    user.licenseNumber = licenseNumber;
    user.vehicleRegistration = vehicleRegistration;
    user.profileComplete = true;
    await user.save();
    res.redirect('/dashboard/driver');
  } else {
    // Handle error or unauthorized access
    res.redirect('/login');
  }
};