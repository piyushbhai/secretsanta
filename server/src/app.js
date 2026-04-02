const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');
const assignmentRoutes = require('./routes/assignments');
const { handleErrors } = require('./middleware/errors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/assignments', assignmentRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ msg: 'pong', timestamp: Date.now() });
});

app.use(handleErrors);

module.exports = app;