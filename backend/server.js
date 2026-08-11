require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forestDB';

app.use(cors());
app.use(express.json());

// Mount routers
const speciesRoutes = require('./routes/species');
const incidentRoutes = require('./routes/incident');
const patrolLogRoutes = require('./routes/patrolLog');
const authRoutes = require('./routes/auth');
const forestRoutes = require('./routes/forest');
const treeRoutes = require('./routes/tree');
const wildlifeRoutes = require('./routes/wildlife');
const environmentalDataRoutes = require('./routes/environmentalData');

app.use('/api/auth', authRoutes);
app.use('/api/forests', forestRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/wildlife', wildlifeRoutes);
app.use('/api/environmental-data', environmentalDataRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/patrol-logs', patrolLogRoutes);

// Sample /api/reports endpoint for frontend Reports page
app.get('/api/reports', async (req, res) => {
	try {
		// Example: Combine incidents and patrol logs for reporting
		const Incident = require('./models/Incident');
		const PatrolLog = require('./models/PatrolLog');
		const incidents = await Incident.find().limit(5).sort({ createdAt: -1 });
		const patrolLogs = await PatrolLog.find().limit(5).sort({ date: -1 });
		const reports = [
			{
				title: 'Recent Incidents',
				summary: incidents.map(i => `${i.type || 'Incident'}: ${i.description || ''}`).join('\n')
			},
			{
				title: 'Recent Patrol Logs',
				summary: patrolLogs.map(p => `Ranger: ${p.ranger || ''}, Date: ${p.date || ''}, Notes: ${p.notes || ''}`).join('\n')
			}
		];
		res.json(reports);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

app.get('/', (req, res) => {
	res.send('Forest API Running');
});


// Error handler (should be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

mongoose
   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
	   console.log('Connected to MongoDB');
	   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   })
   .catch((err) => {
	   console.error('Failed to connect to MongoDB', err);
	   process.exit(1);
   });

