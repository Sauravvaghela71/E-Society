const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const Database = require("./Database/DB");

/* ---------------- ROUTES ---------------- */

const user = require("./src/Route/SignupRoute");
const resident = require("./src/Route/ResidentRoute");
const security = require("./src/Route/SecurityRoute");
const society = require("./src/Route/SocietyRoute");
const SignupRoute = require("./src/Route/SignupRoute")

/* ---------------- DATABASE CONNECTION ---------------- */

Database();

/* ---------------- MIDDLEWARES ---------------- */

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use("/api/users",user);
app.use("/api/residents", resident);
app.use("/api/security",security)
app.use("/api/",society)
app.use("/api",SignupRoute)

/* ---------------- TEST API ---------------- */

app.get("/", (req, res) => {
  res.send("E-Society API Running");
});

/* ---------------- SERVER ---------------- */

const PORT = 5100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});