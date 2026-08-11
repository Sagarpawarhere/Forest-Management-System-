const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sagar';

async function authenticateJWT(req, res, next) {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'No token provided' });
		}

		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });

		const user = await User.findById(decoded.id).select('-password');
		if (!user) return res.status(401).json({ message: 'User not found' });

		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

function authorizeRoles(...roles) {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden: insufficient role' });
		}
		next();
	};
}

module.exports = { authenticateJWT, authorizeRoles };

