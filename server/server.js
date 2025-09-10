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

// Auth
app.use("/auth", routerAuth);

// Users
app.use("/users", routerUsers);

// Projects
app.use("/projects", routerProjects);

// Events
app.use("/events", routerEvents);

// Startups
app.use("/startups", routerStartups);

// News
app.use("/news", routerNews);

// 404 Not Found
app.use(notFound);

// Lancement serveur
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
