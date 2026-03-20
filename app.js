const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const session = require("express-session");
const RedisStoreFactory = require("connect-redis").default;
const IORedis = require("ioredis");
const flash = require("connect-flash");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const http = require("http");

// ------------------- Load .env ------------------- //
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

// ------------------- App & Config ------------------- //
const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ------------------- Security ------------------- //
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ------------------- Logging, Compression & Parsing ------------------- //
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ------------------- Static Files ------------------- //
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: NODE_ENV === "production" ? "30d" : 0,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// ------------------- Session + Flash ------------------- //
let redisClient = null;
const SESSION_SECRET = process.env.SESSION_SECRET || "please_set_a_secret";

function createSessionMiddleware() {
  const redisUrl = process.env.REDIS_URL || null;

  if (redisUrl) {
    try {
      redisClient = new IORedis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
      });

      redisClient.on("error", (err) =>
        console.error("Redis client error:", err)
      );

      const RedisStore = RedisStoreFactory;
      const store = new RedisStore({ client: redisClient });

      console.log("✅ Using Redis session store");

      return session({
        store,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
        },
      });
    } catch (err) {
      console.error("❌ Redis init failed:", err);
    }
  }

  console.warn(
    "⚠️ REDIS_URL not set. Falling back to in-memory session store (not recommended for production)."
  );
  return session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
}

app.use(createSessionMiddleware());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// ------------------- Rate Limiting ------------------- //
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ------------------- View Engine ------------------- //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------- Routes ------------------- //
app.get("/health", (req, res) => res.status(200).send("ok"));

app.get("/", (req, res) => res.render("Homepage"));

app.get("/contact", (req, res) => {
  res.render("contact"); // Only serves the EJS Google Form page
});

app.get("/events", (req, res) => res.render("events"));
app.get("/events/Vincenza6_0", (req, res) => res.render("Vincenza6_0"));
app.get("/events/Vincenza7_0", (req, res) => res.render("Vincenza7_0"));
app.get("/events/CBS", (req, res) => res.render("CBS"));
app.get("/events/catalyst", (req, res) => res.render("catalyst"));

app.get("/initiatives", (req, res) => res.render("Initiatives"));

app.get("/project", (req, res) => res.render("Project"));
app.get("/project/rapido", (req, res) => res.render("rapido"));
app.get("/project/zypp", (req, res) => res.render("zypp"));
app.get("/project/slp", (req, res) => res.render("slp"));
app.get("/project/John-Jacobs", (req, res) => res.render("John-Jacobs"));

app.get("/publications", (req, res) => res.render("Publications"));
app.get("/publications/industryreports", (req, res) =>
  res.render("industryReports")
);
app.get("/publications/equityreports", (req, res) =>
  res.render("equityReports")
);

app.get("/team", (req, res) => res.render("Team"));

// ------------------- Error Handling ------------------- //
app.use((req, res) => res.status(404).send("Page not found"));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(500).send("Something went wrong!");
});

// ------------------- Start Server ------------------- //
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (NODE_ENV=${NODE_ENV})`);
});

// ------------------- Graceful Shutdown ------------------- //
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing server...`);
  server.close(async (err) => {
    if (err) {
      console.error("Error shutting down HTTP server:", err);
      process.exit(1);
    }
    console.log("✅ HTTP server closed.");
    try {
      if (redisClient) {
        await redisClient.quit();
        console.log("✅ Redis client closed.");
      }
    } catch (e) {
      console.error("⚠️ Error closing Redis:", e);
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.warn("⏳ Forced shutdown after 10s");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
