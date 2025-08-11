const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require('./routes/admin.routes');
const app = express();
connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.get('/api', (req, res) => {
    return res.status(200).send({
        sts: 1,
        msg: 'Api running successfully'
    });
})
module.exports = app;
