const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

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
