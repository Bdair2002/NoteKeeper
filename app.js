const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const notesRoutes = require("./routes/notes");

const fs = require("fs");
const { mongo } = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/notes", notesRoutes);

const dbName = "NoteKeeper";
const uri = `${process.env.MONGODB_URI}/${dbName}`;

app.use("/notes", notesRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
