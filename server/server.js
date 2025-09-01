const express = require('express');
const { loggingMiddleware, corsMiddleware } = require('./middleware/middleware.js');
const notFound = require('./middleware/notFound.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(loggingMiddleware);
app.use(corsMiddleware);

// 404 Not Found
app.use(notFound);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
