require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const limiter = require("./middleware/rate-limit");
const error = require("./middleware/error");
const notFound = require("./middleware/not-found");
const authenticate = require("./middleware/authenticate");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const relationshipsRoute = require("./routes/relationship-route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(morgan("dev"));
app.use("/public", express.static("public"));

app.use("/auth", authRoute);
app.use("/users", authenticate, userRoute);
app.use("/relationships", authenticate, relationshipsRoute);

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
