const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;
const ConnectDb = require("./config/db.js");
const routes = require("./routes/index.js");

app.use(express.json());
app.use(cors());
app.use("/api/v1", routes);
app.use(express.urlencoded({ extended: true }));

ConnectDb();
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
