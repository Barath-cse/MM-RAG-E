const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const queryRoutes = require('./routes/queryRoutes');
const systemRoutes = require('./routes/systemRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static files for uploads preview
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/system', systemRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
