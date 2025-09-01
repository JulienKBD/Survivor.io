const bodyParser = require('body-parser');

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const corsMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS')
        res.sendStatus(200);
    else
        next();
};

module.exports = {
    bodyParser,
    loggingMiddleware,
    corsMiddleware
};
