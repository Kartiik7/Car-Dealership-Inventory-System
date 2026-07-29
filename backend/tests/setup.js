const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI_TEST ||
      "mongodb://127.0.0.1:27017/car_inventory_test_db",
  );
});

afterEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) =>
      collection.deleteMany({}),
    ),
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});
