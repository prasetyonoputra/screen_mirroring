require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;
const HB_API_KEY = process.env.HB_API_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY;
let computer = null;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.json());

app.get("/computer", async (req, res) => {
    try {
        if (computer) {
            return res.send(computer);
        }
        const resp = await axios.post(
            "https://engine.hyperbeam.com/v0/vm",
            {},
            {
                headers: { Authorization: `Bearer ${HB_API_KEY}` },
            }
        );
        computer = resp.data;
        res.send(computer);
    } catch (error) {
        console.error("Error fetching computer data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/mirror", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mirror.html'));
});

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
