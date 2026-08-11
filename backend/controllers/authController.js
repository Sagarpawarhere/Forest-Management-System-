const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function register(req, res) {
	try {
		const { name, email, password, role } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Name, email and password are required' });
		}

		const existing = await User.findOne({ email });
		if (existing) return res.status(409).json({ message: 'Email already in use' });

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const user = new User({ name, email, password: hashed, role });
		await user.save();

		const payload = { id: user._id, role: user.role };
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

		const userObj = user.toObject();
		delete userObj.password;

		res.status(201).json({ token, user: userObj });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });

		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(401).json({ message: 'Invalid credentials' });

		const payload = { id: user._id, role: user.role };
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

		const userObj = user.toObject();
		delete userObj.password;

		res.json({ token, user: userObj });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

module.exports = { register, login };

