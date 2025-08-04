const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();
connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);
app.get('/', (req, res) => {
    return res.status(200).send({
        sts: 1,
        msg: 'Api running successfully'
    });
})
module.exports = app;
