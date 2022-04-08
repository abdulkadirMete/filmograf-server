const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
var cors = require('cors')


mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("DB connection is success!!"))
  .catch((err) => console.log(err));
require("./models/Desc");

const movieRouter = require("./routes/movies");
const typeRouter = require("./routes/types");
const notfoundRouter = require("./routes/notfound");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const filterRouter = require("./routes/filter");
const contactRouter = require("./routes/contact");
const toolRouter = require("./routes/tools");
const errorHandler = require("./middlewares/error/errorHandler");

app.use(express.json());
app.use(cors());

// static images
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

// routes
app.use("/api/movies", movieRouter);
app.use("/api/types", typeRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/filter", filterRouter);
app.use("/api/contact", contactRouter);
app.use("/api/tools", toolRouter);
app.all("*", notfoundRouter);

app.listen(process.env.PORT, () => {
  console.log("Backend server is running!!");
});

// error handler
app.use(errorHandler);
