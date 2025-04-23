const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

module.exports = {
  connect: async () => {
    // If mongoose is already connected (e.g. from a stray app.connect), disconnect first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Spin up in-memory Mongo
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  closeDatabase: async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
  },

  clearDatabase: async () => {
    const { collections } = mongoose.connection;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  },
};
