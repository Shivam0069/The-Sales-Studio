const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");

const claimRoute = require("./routes/claim.routes");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/claim", claimRoute);

module.exports = { app };
