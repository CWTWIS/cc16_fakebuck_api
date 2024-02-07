require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const limiter = require("./middleware/rate-limit");
const error = require("./middleware/error");
const notFound = require("./middleware/not-found");
const authRoute = require("./routes/auth-route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(morgan("dev"));

app.use("/auth", authRoute);

app.post(
  "/upload",
  require("./middleware/upload").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log(req.file);
    console.log("================");
    console.log(req.files);
  }
);

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
