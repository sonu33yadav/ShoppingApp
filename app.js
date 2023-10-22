const express = require("express");
const router = express.Router();
const app = express();
const routes = require("./apis");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const swaggerJsdoc = require("swagger-jsdoc");
const bodyParser = require("body-parser");
const log = require("./helper/log");
const swaggerUi = require("swagger-ui-express");
const basicAuth = require("express-basic-auth");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const auth = require("./middleware/auth");
dotenv.config();

const corsOpts = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOpts));
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static("./users"));
app.use(express.json());
app.use("/customer", customerRoutes);
app.use("/admin", adminRoutes);

app.use("/register", (req, res) => {
  log.info("On Route [Run], [register]");
  try {
    var controler = require("./controller/signUp");
    controler.SignUp(req, res);
  } catch (error) {
    console.log(error);
    log.info("On Route [Run], [register], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});
app.use("/register", (req, res) => {
  log.info("On Route [Run], [register]");
  try {
    var controler = require("./controller/signUp");
    controler.SignUp(req, res);
  } catch (error) {
    console.log(error);
    log.info("On Route [Run], [register], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});

app.use("/verify-otp", (req, res) => {
  log.info("On Route [Run], [verify-otp]");
  try {
    var controler = require("./controller/signUp");
    controler.verifyOtp(req, res);
  } catch (error) {
    console.log(error);
    log.info("On Route [Run], [verify-otp], [" + error + "]");
    res.status(404).json({ msg: "Invalid Request" });
  }
});




let PORT = process.env.PORT || 8080;
var LINK = process.env.SERVER_LINK_LIVE;
if (3004 == PORT) {
  var LINK = process.env.SERVER_LINK;
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("App listening on port " + PORT);
});
