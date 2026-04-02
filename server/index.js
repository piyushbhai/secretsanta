require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server up on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log('failed to start:', err.message);
  });