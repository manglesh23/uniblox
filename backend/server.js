const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./connectDatabase/connectDatabase");
const router = require("./router/index");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use("/", router);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
