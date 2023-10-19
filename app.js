const express = require("express");
// const routes = express.Router();
const app = express();
const routes = require("./apis");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const swaggerJsdoc = require("swagger-jsdoc");
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const basicAuth = require("express-basic-auth");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const auth = require("./middleware/auth");
dotenv.config();
// const corsOpts = {
//   origin: '*',

//   methods: [
//     'GET',
//     'POST',
//   ],

//   allowedHeaders: [
//     'Content-Type',
//   ],
// };

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

//  Connect all our routes to our application
// app.use("/", routes);

// Turn on that server!
let PORT = process.env.PORT || 8080;
var LINK = process.env.SERVER_LINK_LIVE;
if (3004 == PORT) {
  var LINK = process.env.SERVER_LINK;
}

app.listen(PORT, "0.0.0.0", () => {
  // console.log("App listening on port " + PORT);
});
