require("dotenv").config();

// Initialization of the express app
const express = require("express");
const books = require("./routes/books");
const mongoose = require("mongoose");
const cors = require("cors")

//Express app initialization
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/books", books);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB and listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

