const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const jobRoute = require("./routes/job");
const applicationRoute = require("./routes/application");
const path = require("path");
const notFound = require("./middleware/notFound");
const bodyparser = require("body-parser");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
require("dotenv").config();
const app = express();
app.use(bodyparser.json());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/files", express.static(path.join(__dirname, "uploads")));
app.use(notFound);
app.use(errorHandlerMiddleware);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("connected");
    });
  })
  .catch((error) => {
    console.log(error);
  });
