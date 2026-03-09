const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const Database = require("./Database/DB");

/* ---------------- ROUTES ---------------- */

const user = require("./src/Route/UserRouter");
const resident = require("./src/Route/ResidentRoute");

/* ---------------- DATABASE CONNECTION ---------------- */

Database();

/* ---------------- MIDDLEWARES ---------------- */

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use("/api/users", user);
app.use("/api/residents", resident);

/* ---------------- TEST API ---------------- */

app.get("/", (req, res) => {
  res.send("E-Society API Running");
});

/* ---------------- SERVER ---------------- */

const PORT = 5100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});