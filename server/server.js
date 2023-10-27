import express from "express";
import cors from "cors";
import fs from 'fs'

const morgan = require("morgan");
require("dotenv").config();

// create express app
const app = express();

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
fs.readdirSync("./routes").map((r) =>
    app.use("/api", require(`./routes/${r}`))
);


// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
    }
);