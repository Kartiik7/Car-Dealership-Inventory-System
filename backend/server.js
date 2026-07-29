const mongoose = require('mongoose');
const app = require('./app');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_inventory_db';
const port = process.env.PORT || 5000;

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port);
  })
  .catch((error) => {
    process.exit(1);
  });