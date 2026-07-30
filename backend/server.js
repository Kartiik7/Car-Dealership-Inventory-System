require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_inventory_db';
const port = process.env.PORT || 5000;

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://127.0.0.1:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });