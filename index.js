const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT;

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

// Connection to DB
require("./config/database.js").connectDB();

// import routes
const user = require("./routes/user.routes.js");
app.use("/api/v1", user);

app.listen(port, () => {
  console.log("Server started on port: ", port);
});
