const express = require("express");
const { loggingMiddleware, corsMiddleware } = require("./middleware/middleware.js");
const routerAuth = require("./routes/auth/auth.js");
const routerUsers = require("./routes/users/users.js");
const routerStartups = require("./routes/startups/startups.js");
const routerProjects = require("./routes/projects/project.js");
const routerEvents = require("./routes/events/events.js");
const routerNews = require("./routes/news/news.js");
const notFound = require("./middleware/notFound.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(loggingMiddleware);
app.use(corsMiddleware);

// Authentication
app.post('/auth/register', routerAuth);
app.post('/auth/login', routerAuth);

// Users
app.get('/users', routerUsers);
app.get('/users/:userId', routerUsers);
app.put('/users/:userId', routerUsers);
app.delete('/users/:userId', routerUsers);

// Projects
app.post('/projects', routerProjects);
app.get('/projects', routerProjects);
app.get('/projects/:id', routerProjects);
app.put('/projects/:id', routerProjects);
app.delete('/projects/:id', routerProjects);
app.put('/projects/:id/views', routerProjects);

// Events
app.post('/events', routerEvents);
app.get('/events', routerEvents);
app.get('/events/:id', routerEvents);
app.put('/events/:id', routerEvents);
app.delete('/events/:id', routerEvents);

// Startups
app.post('/startups', routerStartups);
app.get('/startups', routerStartups);
app.get('/startups/:id', routerStartups);
app.get('/startups/:id/image', routerStartups);
app.put('/startups/:id', routerStartups);
app.delete('/startups/:id', routerStartups);

// news
app.post('/news', routerNews);
app.get('/news', routerNews);
app.get('/news/:id', routerNews);
app.put('/news/:id', routerNews);
app.delete('/news/:id', routerNews);

// 404 Not Found
app.use(notFound);

// Lancement serveur
app.listen(port, () => {
  console.log(`Server is running on ${process.env.RENDER_URL}:${port}`);
});
