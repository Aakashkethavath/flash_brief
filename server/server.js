require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
    'http://localhost:5173', // Local Vite dev server
    'http://localhost:3000', // Local backup
    process.env.FRONTEND_URL // Vercel production URL (can be comma separated or single)
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.urlencoded({ extended: true }));

const rateLimitStore = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

const apiLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, { count: 1, startTime: now });
        return next();
    }

    const record = rateLimitStore.get(ip);

    if (now - record.startTime > WINDOW_MS) {
        // Reset window
        record.count = 1;
        record.startTime = now;
        return next();
    }

    if (record.count >= MAX_REQUESTS) {
        return res.status(429).json({
            status: 429,
            success: false,
            message: "Too many requests from this IP, please try again after 15 minutes"
        });
    }

    record.count++;
    next();
};

// Cleanup interval to prevent memory leaks from inactive IPs
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
        if (now - record.startTime > WINDOW_MS) {
            rateLimitStore.delete(ip);
        }
    }
}, WINDOW_MS);

const API_KEY = process.env.API_KEY;

function fetchNews(url, res) {
    //   const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
    axios.get(url)
        .then(response => {
            if (response.data.totalResults > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "News fetched successfully",
                    data: response.data
                });
            }
            else {
                res.json({
                    status: 200,
                    success: true,
                    message: "No news found",
                });
            }
        })
        .catch(error => {
            res.json({
                status: 500,
                success: false,
                message: "Error fetching news",
                error: error.message
            });
        });
}

//all news
app.get("/news", apiLimiter, (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 50;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});
//country
app.options("/country/:iso", cors());
app.get("/country/:iso", apiLimiter, (req, res) => {
    const country = req.params.iso;
    let pageSize = parseInt(req.query.pageSize) || 50;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});

//top headlines
app.options("/top-headlines", cors());
app.get("/top-headlines", apiLimiter, (req, res) => {
    let country = req.query.country || "us";
    let category = req.query.category || "general";
    let pageSize = parseInt(req.query.pageSize) || 50;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
    });
});

//port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});