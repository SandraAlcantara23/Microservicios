const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const contactRoutes = require("./routes/contact.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactRoutes);

app.get("/", (req, res) => {
  res.send("MS2 funcionando");
});

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://root:1234@mongodb:27017/ms2_db?authSource=admin";

mongoose
  .connect(MONGO_URI)
  .then(() =>
    app.listen(3000, "0.0.0.0", () => {
      console.log("servidor2 corriendo");
      console.log("Mongo URI:", MONGO_URI);
    })
  )
  .catch((err) => console.error("Error Mongo:", err));