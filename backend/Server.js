const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const Database = require("./Database/DB");

/* ROUTES */

const user = require("./src/Route/UserRoute");
const resident = require("./src/Route/ResidentRoute");
const expense = require("./src/Route/ExpenseRoute")
const security = require("./src/Route/SecurityRoute");
const society = require("./src/Route/SocietyRoute");
const complaint = require("./src/Route/ComplainRoute");
const notice = require("./src/Route/NoticeRoute");
const visitor = require("./src/Route/VisitorRoute");
const totalExpense = require("./src/Route/TotalExpenseRoute");
const facility = require("./src/Route/FacilityRoute");
const flat = require("./src/Route/FlatRoute");
const maintenance = require("./src/Route/MaintenanceRoute");

/* DATABASE */

Database();

/* MIDDLEWARE */

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

/* ROUTES */

app.use("/api/user", user);
app.use("/api/residents", resident);
app.use("/api/expense", expense)
app.use("/api/security", security);
app.use("/api/society", society);
app.use("/api/complaint", complaint);
app.use("/api/notice", notice);
app.use("/api/visitor", visitor);
app.use("/api/totalExpense", totalExpense);
app.use("/api/facilities", facility);
app.use("/api/flats", flat);
app.use("/api/maintenance", maintenance);

/* TEST */

app.get("/", (req, res) => {
  res.send("E-Society API Running");
});

/* SERVER */

const PORT = 5100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});