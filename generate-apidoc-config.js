const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const config = {
    name: "My API",
    version: "1.0.0",
    description: "API documentation for my small project",
    title: "My API Docs",
    url: process.env.BASE_URL || "http://localhost:3000/apidoc"
};

fs.writeFileSync("apidoc.json", JSON.stringify(config, null, 2));
console.log("✅ apidoc.json generated with .env URL");
