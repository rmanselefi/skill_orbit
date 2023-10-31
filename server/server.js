import express from "express";
import cors from "cors";
import fs from 'fs'
import mongoose from 'mongoose'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'


const morgan = require("morgan");
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));
// apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
fs.readdirSync("./routes").map((r) =>
    app.use("/api", require(`./routes/${r}`))
);
app.use(cookieParser());
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
    }
);