const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ Missing MONGO_URL. Set it in the .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ Database connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  });

mongoose.connection.once("open", async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(
    "📂 Colecțiile existente în baza de date:",
    collections.map((c) => c.name)
  );
});
