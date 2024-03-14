const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connection Established to DB Successfully!! ✅"))
    .catch((error) => {
      console.log("Error while connection to DB ❌ ", error);
      process.exit(1);
    });
};
